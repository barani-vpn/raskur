package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"html"
	"io"
	"log"
	"mime"
	"net"
	"net/http"
	"net/mail"
	"net/netip"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"sync"
	"syscall"
	"time"
	"unicode"
	"unicode/utf8"
)

var hosts = map[string]string{"cloud": "cloud.raskur.tech", "edu": "raskur.tech"}
var idPattern = regexp.MustCompile(`^[a-f0-9]{32}$`)

const maxBody = 32 * 1024

type record struct {
	ID             string            `json:"id"`
	Kind           string            `json:"kind"`
	Lang           string            `json:"lang"`
	CreatedAt      time.Time         `json:"created_at"`
	Consent        bool              `json:"consent"`
	ConsentAt      time.Time         `json:"consent_at"`
	PrivacyVersion string            `json:"privacy_version"`
	Fields         map[string]string `json:"fields"`
}

type window struct {
	until time.Time
	count int
}

type app struct {
	data, site string
	mu         sync.Mutex
	clients    map[netip.Addr]window
	global     window
}

func choose(lang, ru, en string) string {
	if lang == "ru" {
		return ru
	}
	return en
}

func failure(w http.ResponseWriter, status int, lang, message string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(status)
	fmt.Fprintf(w, `<!doctype html><html lang="%s"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>%s</title><h1>%s</h1><p>%s</p></html>`,
		choose(lang, "ru", "en"), choose(lang, "Запрос не сохранён", "Request not saved"), html.EscapeString(message),
		choose(lang, "Вернитесь назад в браузере, проверьте данные и попробуйте снова.", "Use your browser’s Back button to check your details and try again."))
}

func (a *app) handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) { fmt.Fprintln(w, "ok") })
	mux.HandleFunc("POST /api/registrations/withdraw", a.withdraw)
	mux.HandleFunc("POST /api/registrations/{kind}", a.submit)
	mux.HandleFunc("GET /requests/{id}", a.receipt)
	mux.HandleFunc("GET /en/requests/{id}", a.receipt)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		// no-referrer makes native POSTs send Origin: null; keep receipt URLs same-origin instead
		w.Header().Set("Referrer-Policy", "same-origin")
		w.Header().Set("X-Robots-Tag", "noindex, nofollow")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Content-Security-Policy", "default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'")
		mux.ServeHTTP(w, r)
	})
}

func (a *app) allow(ip netip.Addr, now time.Time) bool {
	a.mu.Lock()
	defer a.mu.Unlock()
	// ponytail: single-process limits; share counters if the service gains replicas
	if a.clients == nil {
		a.clients = make(map[netip.Addr]window)
	}
	if !now.Before(a.global.until) {
		a.global = window{until: now.Add(15 * time.Minute)}
	}
	if a.global.count >= 250 {
		return false
	}
	entry, exists := a.clients[ip]
	if !exists && len(a.clients) >= 1024 {
		for key, value := range a.clients {
			if !now.Before(value.until) {
				delete(a.clients, key)
			}
		}
		if len(a.clients) >= 1024 {
			return false
		}
	}
	if !now.Before(entry.until) {
		entry = window{until: now.Add(15 * time.Minute)}
	}
	if entry.count >= 10 {
		return false
	}
	entry.count++
	a.clients[ip] = entry
	a.global.count++
	return true
}

func (a *app) form(w http.ResponseWriter, r *http.Request) (url.Values, bool) {
	if (r.Host != hosts["cloud"] && r.Host != hosts["edu"]) || r.Header.Get("Origin") != "https://"+r.Host {
		failure(w, 403, "en", "This form must be submitted from the Raskur website.")
		return nil, false
	}
	ip, err := netip.ParseAddr(r.Header.Get("X-Real-IP"))
	if err != nil {
		failure(w, 400, "en", "The request could not be verified.")
		return nil, false
	}
	if !a.allow(ip.Unmap(), time.Now()) {
		w.Header().Set("Retry-After", "900")
		failure(w, 429, "en", "Too many requests. Please try again later.")
		return nil, false
	}
	media, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || media != "application/x-www-form-urlencoded" {
		failure(w, 415, "en", "Use the registration form to submit this request.")
		return nil, false
	}
	if r.URL.RawQuery != "" {
		failure(w, 400, "en", "Submit details in the form, not the URL.")
		return nil, false
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxBody)
	if err := r.ParseForm(); err != nil {
		var tooLarge *http.MaxBytesError
		if errors.As(err, &tooLarge) {
			failure(w, 413, "en", "The form is too large.")
		} else {
			failure(w, 400, "en", "The form could not be read.")
		}
		return nil, false
	}
	return r.PostForm, true
}

func validate(kind string, values url.Values) (map[string]string, string) {
	lengths := map[string]int{"name": 120, "email": 254, "message": 1000, "lang": 2, "consent": 3, "website": 0}
	choices := map[string][]string{}
	optional := map[string]bool{"message": true, "website": true}
	if kind == "cloud" {
		lengths["company"], lengths["role"] = 120, 80
		optional["role"] = true
		choices["service"] = []string{"compute", "s3", "efs", "kubernetes", "postgresql", "clickhouse", "multiple"}
		choices["timeline"] = []string{"now", "quarter", "exploring"}
	} else {
		lengths["country"] = 80
		choices["age"] = []string{"16-17", "18-24", "25-plus"}
		choices["stage"] = []string{"school", "college", "gap-year", "other"}
		choices["subject"] = []string{"stem", "sciences", "social", "arts", "undecided"}
		choices["support"] = []string{"admissions", "funding", "mentoring", "research", "combined"}
		choices["timeline"] = []string{"next-intake", "later", "exploring"}
	}
	for key := range choices {
		lengths[key] = 32
	}
	clean := make(map[string]string)
	for key, vs := range values {
		limit, known := lengths[key]
		if !known || len(vs) != 1 {
			return nil, "fields"
		}
		v := vs[0]
		if key == "website" && v != "" {
			return nil, key
		}
		if !utf8.ValidString(v) || strings.ContainsFunc(v, func(r rune) bool { return unicode.IsControl(r) && !(key == "message" && (r == '\n' || r == '\r')) }) {
			return nil, key
		}
		v = strings.TrimSpace(v)
		if utf8.RuneCountInString(v) > limit || (!optional[key] && v == "") {
			return nil, key
		}
		if options, ok := choices[key]; ok && !slices.Contains(options, v) {
			return nil, key
		}
		clean[key] = v
	}
	for key := range lengths {
		if !optional[key] && clean[key] == "" {
			return nil, key
		}
	}
	if values.Get("lang") != "ru" && values.Get("lang") != "en" {
		return nil, "lang"
	}
	if clean["consent"] != "yes" {
		return nil, "consent"
	}
	email := clean["email"]
	address, err := mail.ParseAddress(email)
	if err != nil || address.Address != email || address.Name != "" || strings.ContainsAny(email, " \t\r\n<>") || len(email) > 254 {
		return nil, "email"
	}
	delete(clean, "lang")
	delete(clean, "consent")
	delete(clean, "website")
	return clean, ""
}

func syncDirectory(dir string) error {
	f, err := os.Open(dir)
	if err != nil {
		return err
	}
	defer f.Close()
	return f.Sync()
}

func (a *app) save(rec record) error {
	f, err := os.CreateTemp(a.data, ".request-")
	if err != nil {
		return err
	}
	defer os.Remove(f.Name())
	defer f.Close()
	if err = json.NewEncoder(f).Encode(rec); err != nil {
		return err
	}
	if err = f.Sync(); err != nil {
		return err
	}
	if err = f.Close(); err != nil {
		return err
	}
	path := filepath.Join(a.data, rec.ID+".json")
	if err = os.Link(f.Name(), path); err != nil {
		return err
	}
	if err = os.Remove(f.Name()); err != nil {
		os.Remove(path)
		return err
	}
	if err = syncDirectory(a.data); err != nil {
		os.Remove(path)
		return err
	}
	return nil
}

func (a *app) load(id, host string) (record, error) {
	var rec record
	if !idPattern.MatchString(id) {
		return rec, os.ErrNotExist
	}
	f, err := os.Open(filepath.Join(a.data, id+".json"))
	if err != nil {
		return rec, err
	}
	defer f.Close()
	if err = json.NewDecoder(io.LimitReader(f, 32*1024)).Decode(&rec); err != nil {
		return rec, err
	}
	if rec.ID != id || hosts[rec.Kind] == "" || hosts[rec.Kind] != host {
		return rec, os.ErrNotExist
	}
	return rec, nil
}

func (a *app) template(kind, lang string) ([]byte, error) {
	page, err := os.ReadFile(filepath.Join(a.site, "registration-receipt", kind, lang, "index.html"))
	if err != nil {
		return nil, err
	}
	if !strings.Contains(string(page), "__REQUEST_ID__") || !strings.Contains(string(page), "__REQUEST_STATE__") {
		return nil, errors.New("invalid receipt template")
	}
	return page, nil
}

func render(w http.ResponseWriter, content []byte, id, state string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	io.WriteString(w, strings.NewReplacer("__REQUEST_ID__", id, "__REQUEST_STATE__", state).Replace(string(content)))
}

func (a *app) submit(w http.ResponseWriter, r *http.Request) {
	kind := r.PathValue("kind")
	if hosts[kind] == "" {
		http.NotFound(w, r)
		return
	}
	if hosts[kind] != r.Host {
		failure(w, 403, "en", "Use the matching registration website.")
		return
	}
	v, ok := a.form(w, r)
	if !ok {
		return
	}
	lang := v.Get("lang")
	fields, bad := validate(kind, v)
	if bad != "" {
		failure(w, 422, lang, choose(lang, "Проверьте поле: ", "Please check this field: ")+bad)
		return
	}
	if _, err := a.template(kind, lang); err != nil {
		failure(w, 503, lang, choose(lang, "Форма временно недоступна.", "Registration is temporarily unavailable."))
		return
	}
	id := make([]byte, 16)
	if _, err := rand.Read(id); err != nil {
		failure(w, 503, lang, choose(lang, "Не удалось сохранить запрос.", "The request could not be saved."))
		return
	}
	now := time.Now().UTC()
	rec := record{ID: hex.EncodeToString(id), Kind: kind, Lang: lang, CreatedAt: now, Consent: true, ConsentAt: now, PrivacyVersion: "1", Fields: fields}
	if err := a.save(rec); err != nil {
		log.Print("registration persistence failed")
		failure(w, 503, lang, choose(lang, "Не удалось сохранить запрос. Попробуйте позже.", "The request could not be saved. Please try again later."))
		return
	}
	prefix := ""
	if lang == "en" {
		prefix = "/en"
	}
	http.Redirect(w, r, prefix+"/requests/"+rec.ID, http.StatusSeeOther)
}

func (a *app) receipt(w http.ResponseWriter, r *http.Request) {
	lang := "ru"
	if strings.HasPrefix(r.URL.Path, "/en/") {
		lang = "en"
	}
	rec, err := a.load(r.PathValue("id"), r.Host)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	page, err := a.template(rec.Kind, lang)
	if err != nil {
		failure(w, 503, lang, choose(lang, "Страница временно недоступна.", "This page is temporarily unavailable."))
		return
	}
	render(w, page, rec.ID, "received")
}

func (a *app) withdraw(w http.ResponseWriter, r *http.Request) {
	v, ok := a.form(w, r)
	if !ok {
		return
	}
	lang, id := v.Get("lang"), v.Get("id")
	if len(v) != 2 || len(v["lang"]) != 1 || len(v["id"]) != 1 || (lang != "ru" && lang != "en") || !idPattern.MatchString(id) {
		failure(w, 422, lang, choose(lang, "Некорректный запрос.", "Invalid withdrawal request."))
		return
	}
	rec, err := a.load(id, r.Host)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	page, err := a.template(rec.Kind, lang)
	if err != nil {
		failure(w, 503, lang, choose(lang, "Попробуйте позже.", "Please try again later."))
		return
	}
	if err = os.Remove(filepath.Join(a.data, id+".json")); err != nil {
		failure(w, 503, lang, choose(lang, "Не удалось удалить запрос.", "The request could not be deleted."))
		return
	}
	if err = syncDirectory(a.data); err != nil {
		failure(w, 503, lang, choose(lang, "Не удалось подтвердить удаление.", "Deletion could not be confirmed."))
		return
	}
	render(w, page, id, "withdrawn")
}

func main() {
	listen := flag.String("listen", "127.0.0.1:18732", "loopback listener")
	data := flag.String("data", "/var/lib/raskur-registrations", "private request directory")
	site := flag.String("site", "/var/www/raskur-cloud", "built Astro site")
	flag.Parse()
	host, _, err := net.SplitHostPort(*listen)
	if err != nil || net.ParseIP(host) == nil || !net.ParseIP(host).IsLoopback() {
		log.Fatal("listener must be a loopback IP address")
	}
	if err = os.MkdirAll(*data, 0700); err != nil {
		log.Fatal("cannot create request directory")
	}
	if err = os.Chmod(*data, 0700); err != nil {
		log.Fatal("cannot secure request directory")
	}
	a := &app{data: *data, site: *site}
	server := &http.Server{Addr: *listen, Handler: a.handler(), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 10 * time.Second, IdleTimeout: 30 * time.Second, MaxHeaderBytes: 8192}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	done := make(chan struct{})
	go func() {
		<-ctx.Done()
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		server.Shutdown(shutdown)
		close(done)
	}()
	log.Print("registration receiver listening on ", *listen)
	if err = server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
	<-done
}
