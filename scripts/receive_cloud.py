#!/usr/bin/env python3
import fcntl
import io
import os
import re
import resource
import subprocess
from pathlib import Path
import sys
import tarfile
import tempfile

ROOT = Path('/var/www/raskur-cloud')
BINARY = 'registration-api'
BINARY_TARGET = Path('/opt/raskur-registration/api')
RESTART = ['/usr/bin/sudo', '-n', '/usr/bin/systemctl', 'restart', 'raskur-registration.service']
FILES = {
    'index.html', 'en/index.html', 'frontdoor/index.html', 'frontdoor/en/index.html',
    'frontdoor/grants/index.html', 'frontdoor/en/grants/index.html',
    'register/index.html', 'en/register/index.html',
    'frontdoor/grants/register/index.html', 'frontdoor/en/grants/register/index.html',
    'registration-receipt/cloud/ru/index.html', 'registration-receipt/cloud/en/index.html',
    'registration-receipt/edu/ru/index.html', 'registration-receipt/edu/en/index.html',
    'images/D.svg', 'images/favicon32.png', 'images/og.jpg',
    'fonts/Dodo_Rounded_v2-VF.woff2', 'fonts/Pragmatica.ttf',
}
CSS = re.compile(r'_astro/[A-Za-z0-9_-][A-Za-z0-9_.-]*\.css')
MAX_ARCHIVE = 8 * 1024 * 1024


def install(target, contents, mode):
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(dir=target.parent)
    try:
        with os.fdopen(fd, 'wb') as output:
            output.write(contents)
            output.flush()
            os.fsync(output.fileno())
            os.fchmod(output.fileno(), mode)
        os.replace(temporary, target)
    finally:
        Path(temporary).unlink(missing_ok=True)


def main():
    if sys.platform.startswith('linux'):
        resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
        resource.setrlimit(resource.RLIMIT_CPU, (10, 10))
    data = sys.stdin.buffer.read(MAX_ARCHIVE + 1)
    if len(data) > MAX_ARCHIVE:
        raise ValueError('archive too large')
    with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as archive:
        members = archive.getmembers()
        names = [m.name for m in members]
        if len(names) > 64 or len(names) != len(set(names)) or not (FILES | {BINARY}) < set(names):
            raise ValueError('unexpected archive contents')
        if any(name not in FILES and name != BINARY and not CSS.fullmatch(name) for name in names):
            raise ValueError('unexpected archive path')
        if any(not m.isfile() or m.size > MAX_ARCHIVE for m in members):
            raise ValueError('invalid archive member')
        if sum(m.size for m in members) > MAX_ARCHIVE:
            raise ValueError('unpacked archive too large')
        files = {}
        for member in members:
            source = archive.extractfile(member)
            if source is None:
                raise ValueError('missing archive member')
            files[member.name] = source.read()
    binary = files.pop(BINARY)
    if not binary.startswith(b'\x7fELF'):
        raise ValueError('expected a Linux registration executable')
    with open(ROOT / '.deploy.lock', 'w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        for name, contents in files.items():
            install(ROOT / name, contents, 0o644)
        if not BINARY_TARGET.exists() or BINARY_TARGET.read_bytes() != binary:
            install(BINARY_TARGET, binary, 0o755)
            subprocess.run(RESTART, check=True, timeout=30)
    print('deployed', len(files), 'files')


if __name__ == '__main__':
    main()
