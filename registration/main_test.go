package main

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"
)

func fixture(t *testing.T) (*app, *httptest.Server) {
	t.Helper()
	root := t.TempDir()
	a := &app{data: filepath.Join(root, "data"), site: filepath.Join(root, "site")}
	if err := os.MkdirAll(a.data, 0700); err != nil {
		t.Fatal(err)
	}
	for _, kind := range []string{"cloud", "edu"} {
		for _, lang := range []string{"ru", "en"} {
			p := filepath.Join(a.site, "registration-receipt", kind, lang, "index.html")
			if err := os.MkdirAll(filepath.Dir(p), 0755); err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(p, []byte(`<html lang="`+lang+`"><main data-request-state="__REQUEST_STATE__">__REQUEST_ID__</main></html>`), 0644); err != nil {
				t.Fatal(err)
			}
		}
	}
	s := httptest.NewServer(a.handler())
	t.Cleanup(s.Close)
	return a, s
}

func fields(kind, lang string) url.Values {
	v := url.Values{"lang": {lang}, "name": {"Тестовый участник"}, "email": {"verification@example.invalid"}, "consent": {"yes"}, "website": {""}, "message": {"Verification only\nNo real applicant"}}
	if kind == "cloud" {
		v.Set("company", "Verification only")
		v.Set("service", "compute")
		v.Set("timeline", "exploring")
	} else {
		for k, value := range map[string]string{"country": "Georgia", "age": "16-17", "stage": "school", "subject": "stem", "support": "combined", "timeline": "next-intake"} {
			v.Set(k, value)
		}
	}
	return v
}

func request(t *testing.T, s *httptest.Server, method, path, host, origin, body, media, ip string) *http.Response {
	t.Helper()
	r, err := http.NewRequest(method, s.URL+path, strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	r.Host = host
	r.Header.Set("Origin", origin)
	r.Header.Set("Content-Type", media)
	r.Header.Set("X-Real-IP", ip)
	client := &http.Client{Timeout: 5 * time.Second, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	res, err := client.Do(r)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { res.Body.Close() })
	return res
}

func post(t *testing.T, s *httptest.Server, kind string, v url.Values) *http.Response {
	t.Helper()
	host := "cloud.raskur.tech"
	if kind == "edu" {
		host = "raskur.tech"
	}
	return request(t, s, "POST", "/api/registrations/"+kind, host, "https://"+host, v.Encode(), "application/x-www-form-urlencoded", "192.0.2.1")
}

func records(t *testing.T, dir string) []string {
	t.Helper()
	paths, err := filepath.Glob(filepath.Join(dir, "*.json"))
	if err != nil {
		t.Fatal(err)
	}
	return paths
}

func TestRegistrationPersistenceReceiptAndWithdrawal(t *testing.T) {
	for _, kind := range []string{"cloud", "edu"} {
		for _, lang := range []string{"ru", "en"} {
			t.Run(kind+"/"+lang, func(t *testing.T) {
				a, s := fixture(t)
				v := fields(kind, lang)
				res := post(t, s, kind, v)
				if res.StatusCode != 303 {
					b, _ := io.ReadAll(res.Body)
					t.Fatalf("POST: %d %s", res.StatusCode, b)
				}
				paths := records(t, a.data)
				if len(paths) != 1 {
					t.Fatalf("saved files: %v", paths)
				}
				data, err := os.ReadFile(paths[0])
				if err != nil {
					t.Fatal(err)
				}
				var saved record
				if err := json.Unmarshal(data, &saved); err != nil {
					t.Fatal(err)
				}
				if saved.Kind != kind || saved.Lang != lang || saved.Fields["email"] != v.Get("email") || !saved.Consent || saved.PrivacyVersion != "1" || saved.CreatedAt.IsZero() || !saved.CreatedAt.Equal(saved.ConsentAt) {
					t.Fatalf("incorrect saved record: %#v", saved)
				}
				for _, forbidden := range []string{"192.0.2.1", `"website"`, `"password"`} {
					if strings.Contains(string(data), forbidden) {
						t.Fatalf("stored unwanted field %s", forbidden)
					}
				}
				info, _ := os.Stat(paths[0])
				if info.Mode().Perm() != 0600 {
					t.Fatal("record is not private")
				}
				dirInfo, _ := os.Stat(a.data)
				if dirInfo.Mode().Perm() != 0700 {
					t.Fatal("directory is not private")
				}
				loc := res.Header.Get("Location")
				prefix := "/requests/"
				if lang == "en" {
					prefix = "/en/requests/"
				}
				if loc != prefix+saved.ID || len(saved.ID) != 32 {
					t.Fatalf("receipt location %q", loc)
				}
				restarted := &app{data: a.data, site: a.site}
				s2 := httptest.NewServer(restarted.handler())
				defer s2.Close()
				host := "cloud.raskur.tech"
				if kind == "edu" {
					host = "raskur.tech"
				}
				r := request(t, s2, "GET", loc, host, "", "", "", "192.0.2.1")
				body, _ := io.ReadAll(r.Body)
				if r.StatusCode != 200 || !strings.Contains(string(body), saved.ID) || !strings.Contains(string(body), `data-request-state="received"`) || !strings.Contains(string(body), `lang="`+lang+`"`) {
					t.Fatalf("receipt: %d %s", r.StatusCode, body)
				}
				if strings.Contains(string(body), v.Get("email")) || strings.Contains(string(body), v.Get("name")) || strings.Contains(string(body), "__REQUEST_") {
					t.Fatal("receipt leaks data or has placeholders")
				}
				if r.Header.Get("Cache-Control") != "no-store" || r.Header.Get("Referrer-Policy") != "same-origin" || !strings.Contains(r.Header.Get("X-Robots-Tag"), "noindex") {
					t.Fatal("receipt privacy headers missing")
				}
				withdraw := url.Values{"id": {saved.ID}, "lang": {lang}}
				r = request(t, s2, "POST", "/api/registrations/withdraw", host, "https://evil.invalid", withdraw.Encode(), "application/x-www-form-urlencoded", "192.0.2.1")
				if r.StatusCode != 403 || len(records(t, a.data)) != 1 {
					t.Fatal("foreign origin withdrew a request")
				}
				r = request(t, s2, "POST", "/api/registrations/withdraw", host, "https://"+host, withdraw.Encode(), "application/x-www-form-urlencoded", "192.0.2.1")
				body, _ = io.ReadAll(r.Body)
				if r.StatusCode != 200 || !strings.Contains(string(body), `data-request-state="withdrawn"`) || len(records(t, a.data)) != 0 {
					t.Fatalf("withdraw failed: %d %s", r.StatusCode, body)
				}
				r = request(t, s2, "GET", loc, host, "", "", "", "192.0.2.1")
				if r.StatusCode != 404 {
					t.Fatalf("deleted receipt status: %d", r.StatusCode)
				}
			})
		}
	}
}

func TestRejectsInvalidRequestsWithoutWriting(t *testing.T) {
	cases := []struct {
		name   string
		mutate func(url.Values)
	}{
		{"missing name", func(v url.Values) { v.Del("name") }}, {"blank name", func(v url.Values) { v.Set("name", "  ") }},
		{"missing consent", func(v url.Values) { v.Del("consent") }}, {"wrong consent", func(v url.Values) { v.Set("consent", "no") }},
		{"bad email", func(v url.Values) { v.Set("email", "not an email") }}, {"display address", func(v url.Values) { v.Set("email", "Person <x@example.invalid>") }},
		{"control", func(v url.Values) { v.Set("name", "Person\x00") }}, {"UTF8", func(v url.Values) { v.Set("name", string([]byte{0xff})) }},
		{"too long", func(v url.Values) { v.Set("message", strings.Repeat("a", 1001)) }}, {"honeypot", func(v url.Values) { v.Set("website", "https://spam.invalid") }},
		{"unknown", func(v url.Values) { v.Set("password", "not stored") }}, {"repeated", func(v url.Values) { v.Add("email", "other@example.invalid") }},
		{"enum", func(v url.Values) { v.Set("timeline", "yesterday") }}, {"locale", func(v url.Values) { v.Set("lang", "../../elsewhere") }},
		{"padded locale", func(v url.Values) { v.Set("lang", " en ") }},
	}
	for _, kind := range []string{"cloud", "edu"} {
		for _, tc := range cases {
			t.Run(kind+"/"+tc.name, func(t *testing.T) {
				a, s := fixture(t)
				v := fields(kind, "en")
				tc.mutate(v)
				r := post(t, s, kind, v)
				if r.StatusCode != 422 || len(records(t, a.data)) != 0 {
					t.Fatalf("status %d, records %v", r.StatusCode, records(t, a.data))
				}
			})
		}
	}
	for _, c := range []struct {
		name, host, origin, media, ip, body string
		status                              int
	}{
		{"foreign origin", "cloud.raskur.tech", "https://evil.invalid", "application/x-www-form-urlencoded", "192.0.2.1", fields("cloud", "en").Encode(), 403},
		{"no origin", "cloud.raskur.tech", "", "application/x-www-form-urlencoded", "192.0.2.1", fields("cloud", "en").Encode(), 403},
		{"wrong host", "raskur.tech", "https://raskur.tech", "application/x-www-form-urlencoded", "192.0.2.1", fields("cloud", "en").Encode(), 403},
		{"json", "cloud.raskur.tech", "https://cloud.raskur.tech", "application/json", "192.0.2.1", "{}", 415},
		{"bad IP", "cloud.raskur.tech", "https://cloud.raskur.tech", "application/x-www-form-urlencoded", "forged", fields("cloud", "en").Encode(), 400},
		{"large", "cloud.raskur.tech", "https://cloud.raskur.tech", "application/x-www-form-urlencoded", "192.0.2.1", "message=" + strings.Repeat("a", 32769), 413},
		{"encoding", "cloud.raskur.tech", "https://cloud.raskur.tech", "application/x-www-form-urlencoded", "192.0.2.1", "name=%ZZ", 400},
	} {
		t.Run(c.name, func(t *testing.T) {
			a, s := fixture(t)
			r := request(t, s, "POST", "/api/registrations/cloud", c.host, c.origin, c.body, c.media, c.ip)
			if r.StatusCode != c.status || len(records(t, a.data)) != 0 {
				t.Fatalf("status %d wanted %d", r.StatusCode, c.status)
			}
		})
	}
}

func TestStorageFailuresAndInvalidReceiptPaths(t *testing.T) {
	a, s := fixture(t)
	if err := os.Remove(filepath.Join(a.site, "registration-receipt/cloud/en/index.html")); err != nil {
		t.Fatal(err)
	}
	if r := post(t, s, "cloud", fields("cloud", "en")); r.StatusCode != 503 || len(records(t, a.data)) != 0 {
		t.Fatal("missing template accepted")
	}
	a, s = fixture(t)
	bad := filepath.Join(t.TempDir(), "file")
	if err := os.WriteFile(bad, []byte("not a directory"), 0600); err != nil {
		t.Fatal(err)
	}
	a.data = bad
	if r := post(t, s, "cloud", fields("cloud", "en")); r.StatusCode != 503 {
		t.Fatalf("disk error returned %d", r.StatusCode)
	}
	a, s = fixture(t)
	for _, path := range []string{"/requests/not-an-id", "/requests/" + strings.Repeat("a", 32), "/requests/%2e%2e%2foutside", "/api/registrations/withdraw"} {
		r := request(t, s, "GET", path, "cloud.raskur.tech", "", "", "", "192.0.2.1")
		if r.StatusCode != 404 && r.StatusCode != 405 {
			t.Fatalf("unexpected path status: %s %d", path, r.StatusCode)
		}
	}
}

func TestRateLimitAndConcurrentPersistence(t *testing.T) {
	a, s := fixture(t)
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if r := post(t, s, "cloud", fields("cloud", "en")); r.StatusCode != 303 {
				t.Errorf("concurrent status %d", r.StatusCode)
			}
		}()
	}
	wg.Wait()
	if len(records(t, a.data)) != 10 {
		t.Fatalf("concurrent records %d", len(records(t, a.data)))
	}
	if r := post(t, s, "cloud", fields("cloud", "en")); r.StatusCode != 429 || r.Header.Get("Retry-After") == "" {
		t.Fatalf("rate limit status %d", r.StatusCode)
	}
	if len(records(t, a.data)) != 10 {
		t.Fatal("rate limited request persisted")
	}
}
