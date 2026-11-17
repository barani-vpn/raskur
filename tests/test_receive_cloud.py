import io
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest

from scripts.receive_cloud import BINARY, FILES as ALLOWED_FILES

ROOT = Path(__file__).resolve().parents[1]
FILES = (*sorted(ALLOWED_FILES), '_astro/layout.abc123.css', BINARY)


def archive(names, symlink=None, binary=b'\x7fELF'):
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode='w:gz') as tar:
        for name in names:
            info = tarfile.TarInfo(name)
            if name == symlink:
                info.type = tarfile.SYMTYPE
                info.linkname = '/etc/passwd'
                tar.addfile(info)
            else:
                data = binary if name == BINARY else b'test'
                info.size = len(data)
                tar.addfile(info, io.BytesIO(data))
    return buffer.getvalue()


class ReceiverTest(unittest.TestCase):
    def test_accepts_static_bundle_and_isolated_binary_and_rejects_invalid_archives(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            command = [sys.executable, '-c',
                       'from pathlib import Path; import scripts.receive_cloud as r; '
                       'root=Path(__import__("sys").argv[1]); '
                       'r.ROOT=root/"site"; r.ROOT.mkdir(exist_ok=True); '
                       'r.BINARY_TARGET=root/"runtime/api"; r.BINARY_TARGET.parent.mkdir(exist_ok=True); '
                       'r.RESTART=["/usr/bin/true"]; r.main()', directory]
            good = subprocess.run(command, input=archive(FILES), cwd=ROOT, capture_output=True)
            self.assertEqual(good.returncode, 0, good.stderr)
            site = root / 'site'
            actual = {p.relative_to(site).as_posix() for p in site.rglob('*') if p.is_file()}
            self.assertEqual(actual, (set(FILES) - {BINARY}) | {'.deploy.lock'})
            self.assertEqual((root / 'runtime/api').read_bytes(), b'\x7fELF')
            self.assertEqual((root / 'runtime/api').stat().st_mode & 0o777, 0o755)
            self.assertFalse((site / BINARY).exists())
            for names, link, binary in (
                ((*FILES, '../escape'), None, b'\x7fELF'),
                ((*FILES, '/absolute'), None, b'\x7fELF'),
                ((*FILES, '_astro/../escape.css'), None, b'\x7fELF'),
                ((*FILES, '_astro/run.js'), None, b'\x7fELF'),
                ((*FILES, 'index.html'), None, b'\x7fELF'),
                (FILES[1:], None, b'\x7fELF'),
                (FILES[:-1], None, b'\x7fELF'),
                (FILES, '_astro/layout.abc123.css', b'\x7fELF'),
                (FILES, BINARY, b'\x7fELF'),
                (FILES, None, b'not a Linux executable'),
                ((*FILES, 'registrations/private.json'), None, b'\x7fELF'),
            ):
                with self.subTest(names=names, link=link, binary=binary):
                    bad = subprocess.run(command, input=archive(names, link, binary), cwd=ROOT, capture_output=True)
                    self.assertNotEqual(bad.returncode, 0)
                    self.assertEqual((site / 'index.html').read_bytes(), b'test')
                    self.assertEqual((root / 'runtime/api').read_bytes(), b'\x7fELF')


if __name__ == '__main__':
    unittest.main()
