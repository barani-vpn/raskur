#!/usr/bin/env python3
"""Usage: build_cloud.py OUT_DIR — builds the standalone cloud.raskur.tech site."""
import hashlib
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = {"cloud.html": "index.html", "en/cloud.html": "en/index.html"}
ASSETS = [
    "assets/cloud-coming.css",
    "images/D.svg",
    "images/favicon32.png",
    "images/og.jpg",
    "fonts/Dodo_Rounded_v2-VF.woff2",
    "fonts/Pragmatica.ttf",
]
BRAND = "https://brandbook.raskur.tech"
CLOUD = "https://cloud.raskur.tech"
LINKS = {
    f"{BRAND}/cloud.html": f"{CLOUD}/",
    f"{BRAND}/en/cloud.html": f"{CLOUD}/en/",
    "/cloud.html": "/",
    "/en/cloud.html": "/en/",
    "/": f"{BRAND}/",
    "/en/": f"{BRAND}/en/",
}
ATTR = re.compile(r'(\b(?:href|src|content)=")([^"]*)(")')


def rewrite(html, assets):
    links = {**LINKS, **assets}
    return ATTR.sub(lambda m: m[1] + links.get(m[2], m[2]) + m[3], html)


def build(out):
    out = Path(out)
    digest = hashlib.sha256()
    for asset in ASSETS:
        digest.update((ROOT / asset).read_bytes())
    version = digest.hexdigest()[:12]
    assets = {f"/{asset}": f"/{asset}?v={version}" for asset in ASSETS}
    for src, dst in PAGES.items():
        (out / dst).parent.mkdir(parents=True, exist_ok=True)
        (out / dst).write_text(rewrite((ROOT / src).read_text(encoding="utf-8"), assets), encoding="utf-8")
    for asset in ASSETS:
        target = out / asset
        target.parent.mkdir(parents=True, exist_ok=True)
        if asset.endswith('.css'):
            css = (ROOT / asset).read_text(encoding='utf-8')
            for name, versioned in assets.items():
                css = css.replace(f'url("{name}")', f'url("{versioned}")')
            target.write_text(css, encoding='utf-8')
        else:
            shutil.copyfile(ROOT / asset, target)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    build(sys.argv[1])
