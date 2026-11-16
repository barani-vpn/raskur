# raskur deployment

Pushes to `master` build the Astro project in `web/` and deploy the front door, cloud site and education programme to poland-1 through GitHub Actions. GitHub Pages continues to serve the separate brandbook. The SSH key is restricted to the root-owned `/usr/local/libexec/raskur-cloud-deploy` receiver; it cannot run commands or modify other services. The receiver accepts only the six site pages, the listed image/font assets and hashed CSS files under `_astro/`.

Use Node 24: `npm ci --prefix web`, then `npm run dev --prefix web`. Shared components and bilingual content live under `web/src/`. Dev routes mirror the output: `/` is the cloud, `/frontdoor/` is the hub and `/frontdoor/grants/` is education, with English equivalents. Public hostnames retain `/` and `/en/`; education is at `/grants/` and `/en/grants/` on the apex.

Build to an empty directory with `python3 scripts/build_cloud.py OUTPUT_DIRECTORY [ARCHIVE]`. Run `RASKUR_BUILD_DIR=OUTPUT_DIRECTORY PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests`; without the variable the tests build a temporary copy. Astro fingerprints the shared CSS. Everything served is static; poland-1 does not need Node.

The Caddy origin listens only on `127.0.0.1:18731`. `deploy/Caddyfile` selects `frontdoor/` for the apex hostname while keeping shared assets and the cloud site at the output root. The existing Cloudflare tunnel has separate ingress rules for `raskur.tech` and `cloud.raskur.tech`, both pointing to this origin; its last rule is `http_status:404`. The brandbook DNS record is unchanged.

To change the receiver or its allowlist, update and test `receive_cloud.py`, then install it separately as root on poland-1 before pushing the workflow change. CI does not update its own receiver or Caddy configuration. Back up both before installing, validate Caddy before restarting only `raskur-cloud.service`, and check the two hostnames with their real Host headers.

For content rollback, revert the source commit and push. For receiver/configuration rollback, restore the paired root-owned backups first and restore the corresponding site snapshot. Do not restart the VPN or other tunnel services.
