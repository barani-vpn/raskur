#!/usr/bin/env python3
"""Usage: build_cloud.py OUT_DIR [ARCHIVE]. Build and package the static Astro sites."""
from pathlib import Path
import os
import subprocess
import sys
import tarfile

ROOT = Path(__file__).resolve().parents[1]


def build(out):
    out = Path(out).resolve()
    if out.exists() and any(out.iterdir()):
        raise ValueError('output directory must be empty')
    subprocess.run(['npm', 'run', 'build', '--', '--outDir', str(out)], cwd=ROOT / 'web', check=True)
    subprocess.run(['go', 'build', '-trimpath', '-buildvcs=false', '-ldflags=-s -w',
                    '-o', str(out / 'registration-api'), '.'], cwd=ROOT / 'registration',
                   env={**os.environ, 'CGO_ENABLED': '0', 'GOOS': 'linux', 'GOARCH': 'amd64'}, check=True)


def package(out, destination):
    out = Path(out).resolve()
    destination = Path(destination).resolve()
    if out in destination.parents:
        raise ValueError('archive must be outside the output directory')
    files = sorted(p for p in out.rglob('*') if p.is_file())
    if not files or any(p.is_symlink() for p in out.rglob('*')):
        raise ValueError('expected a non-empty build without symlinks')
    with tarfile.open(destination, 'w:gz') as archive:
        for path in files:
            archive.add(path, arcname=path.relative_to(out).as_posix(), recursive=False)


if __name__ == '__main__':
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    build(sys.argv[1])
    if len(sys.argv) == 3:
        package(sys.argv[1], sys.argv[2])
