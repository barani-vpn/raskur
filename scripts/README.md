# raskur deployment

Pushes to `master` build the Astro sites and the standard-library Go registration service. GitHub Pages serves the separate brandbook. The restricted SSH receiver cannot run arbitrary SSH commands: it accepts an exact file allowlist, installs the API binary outside the web root and can restart only `raskur-registration.service`.

## build and test

Use Node 24 and Go 1.27:

```
npm ci --prefix web
go -C registration test -race -timeout 60s ./...
python3 scripts/build_cloud.py OUTPUT_DIRECTORY ARCHIVE.tar.gz
RASKUR_BUILD_DIR=OUTPUT_DIRECTORY PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
```

The build cross-compiles a static Linux amd64 `registration-api`. The archive contains ten public pages, four private receipt templates, the API binary, listed images/fonts and fingerprinted CSS. No browser JavaScript or Node service is needed. The receiver installs the binary at `/opt/raskur-registration/api`, never under the public site, and restarts it only when the executable changes.

## public paths

- Cloud: `/`, `/en/`, `/register/`, `/en/register/`
- Apex: `/`, `/en/`, `/grants/`, `/en/grants/`, `/grants/register/`, `/en/grants/register/`
- Receipt links: `/requests/PRIVATE_ID` and `/en/requests/PRIVATE_ID` on the originating hostname

Astro dev/build paths for apex pages have an extra `frontdoor/` prefix. Shared components and bilingual content are under `web/src/`. Cloud header section links point back to the catalogue, including from registration and receipt pages.

## origin and API

Caddy listens only on `127.0.0.1:18731`; the existing Cloudflare tunnel serves both public hostnames. `deploy/Caddyfile` routes registration POSTs, receipts and `/healthz` to `127.0.0.1:18732`, and blocks direct access to receipt templates. Keep the separate brandbook DNS record and the tunnel's terminal 404 unchanged.

`raskur-registration.service` runs as its own unprivileged user with a private state directory, read-only system files, loopback-only networking and resource limits. The deployment user may replace its fixed executable but cannot read the state directory directly or restart other services. Caddy overwrites `X-Real-IP` from Cloudflare's `CF-Connecting-IP`; neither listener is public. Do not expose the API directly or trust visitor-supplied forwarding headers on a new ingress.

The native forms POST URL-encoded data. The API validates host, origin, fields, enum values, consent and request size, applies rate limits and rejects the honeypot. A successful response redirects to a receipt only after the private record is durably saved. There are no accounts, passwords, payment handling, automatic emails or public record-listing endpoints.

## request data

Requests live at `/var/lib/raskur-registrations/*.json`, outside the web root. The directory is private to `raskur-registration` (0700); records are 0600. Each record contains a random request ID, kind, locale, UTC creation time, consent/privacy version and submitted fields. IP addresses and honeypot values are not stored. Records survive application restarts and site deployments.

A receipt link is a bearer capability: keep it private. It does not show the submitted contact details. The owner can use its native withdrawal form to delete that saved request. Receipts use `no-store`, `noindex` and `Referrer-Policy: same-origin`, so private links are not sent to other origins. Do not change this to `no-referrer`: native withdrawal POSTs would send `Origin: null` and fail the origin check. Do not log full receipt URLs or copy real submissions into git, CI output or public diagnostics. Review demand through SSH, not a public admin endpoint. Multiple requests can come from the same person; request totals are not unique-user counts.

## initial installation and infrastructure changes

The runtime, receiver and proxy configuration are installed separately as root before the first new archive is pushed. CI never updates its own receiver, sudoers policy or Caddy configuration.

1. Build and test locally. Stage the archive, receiver and files in `deploy/` on poland-1
2. Back up `/var/www/raskur-cloud`, the current Caddy configuration and receiver, plus any existing registration unit, executable and sudoers entry. Preserve the paired backup path
3. Validate the staged Caddyfile with the currently running Caddy binary and validate `raskur-registration.sudoers` using `visudo -cf`
4. Create the system user `raskur-registration` if absent. Install `/opt/raskur-registration/` and its `api` executable owned by `raskurdeploy`; install the unit and narrowly scoped sudoers entry as root. Systemd creates and owns the separate state directory
5. Install the root-owned receiver at `/usr/local/libexec/raskur-cloud-deploy`. Install the static bundle via that receiver, enable/start the registration unit, and check its loopback `/healthz`
6. Install the validated Caddyfile, restart only `raskur-cloud.service` and verify both real hostnames. Do not restart VPN listeners or the tunnel

## verification and rollback

CI tests the Go receiver with a real temporary filesystem and the archive receiver against invalid paths, links, duplicate entries and wrong executables. It compares all ten public pages byte-for-byte and checks API health and blocked receipt-template URLs. For live acceptance, submit clearly labelled synthetic Cloud and Edu requests, read back those exact private records over SSH, follow the receipts, withdraw them and confirm the files are gone. Never use actual personal details for a smoke test.

For ordinary code/content rollback, revert the source commit and push; the existing receiver still accepts the paired site and executable. To roll back across the initial installation, restore the paired receiver, Caddyfile and website snapshot, stop/disable the new API unit, and preserve its private state directory. Keep any replaced site tree rather than deleting it. Validate Caddy before restarting the dedicated site service. Do not restore public HTML with active forms while leaving the API unavailable.
