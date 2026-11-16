# cloud deployment

Pushes to `master` build the standalone cloud site and deploy it to poland-1 through GitHub Actions. The SSH key is restricted to the root-owned `/usr/local/libexec/raskur-cloud-deploy` receiver; it cannot run commands or modify other services. The receiver accepts only the files listed in `receive_cloud.py`.

To change the receiver or its allowlist, update and test `receive_cloud.py`, then install it separately as root on poland-1. CI does not update its own receiver. The Caddy origin listens only on `127.0.0.1:18731`; Cloudflare Tunnel publishes it at `cloud.raskur.tech`.

Run checks with `python3 -m unittest discover -s tests`. Build a standalone copy with `python3 scripts/build_cloud.py OUTPUT_DIRECTORY`.
