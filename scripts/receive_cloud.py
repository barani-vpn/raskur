#!/usr/bin/env python3
import fcntl
import io
import os
import re
import resource
from pathlib import Path
import sys
import tarfile
import tempfile

ROOT = Path('/var/www/raskur-cloud')
FILES = {
    'index.html', 'en/index.html', 'frontdoor/index.html', 'frontdoor/en/index.html',
    'frontdoor/grants/index.html', 'frontdoor/en/grants/index.html',
    'images/D.svg', 'images/favicon32.png', 'images/og.jpg',
    'fonts/Dodo_Rounded_v2-VF.woff2', 'fonts/Pragmatica.ttf',
}
CSS = re.compile(r'_astro/[A-Za-z0-9_-][A-Za-z0-9_.-]*\.css')
MAX_ARCHIVE = 8 * 1024 * 1024


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
        if len(names) > 64 or len(names) != len(set(names)) or not FILES < set(names):
            raise ValueError('unexpected archive contents')
        if any(name not in FILES and not CSS.fullmatch(name) for name in names):
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
    with open(ROOT / '.deploy.lock', 'w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        for name, contents in files.items():
            target = ROOT / name
            target.parent.mkdir(parents=True, exist_ok=True)
            fd, temporary = tempfile.mkstemp(dir=target.parent)
            with os.fdopen(fd, 'wb') as output:
                output.write(contents)
            os.chmod(temporary, 0o644)
            os.replace(temporary, target)
    print('deployed', len(files), 'files')


if __name__ == '__main__':
    main()
