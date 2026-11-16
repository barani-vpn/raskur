import io
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
FILES = (
    'index.html', 'en/index.html', 'frontdoor/index.html', 'frontdoor/en/index.html',
    'frontdoor/grants/index.html', 'frontdoor/en/grants/index.html',
    'images/D.svg', 'images/favicon32.png', 'images/og.jpg',
    'fonts/Dodo_Rounded_v2-VF.woff2', 'fonts/Pragmatica.ttf',
    '_astro/layout.abc123.css',
)


def archive(names, symlink=None):
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode='w:gz') as tar:
        for name in names:
            info = tarfile.TarInfo(name)
            if name == symlink:
                info.type = tarfile.SYMTYPE
                info.linkname = '/etc/passwd'
                tar.addfile(info)
            else:
                info.size = 4
                tar.addfile(info, io.BytesIO(b'test'))
    return buffer.getvalue()


class ReceiverTest(unittest.TestCase):
    def test_accepts_static_astro_bundle_and_rejects_invalid_archives(self):
        with tempfile.TemporaryDirectory() as directory:
            command = [sys.executable, '-c',
                       'from pathlib import Path; import scripts.receive_cloud as r; '
                       'r.ROOT = Path(__import__("sys").argv[1]); r.main()', directory]
            good = subprocess.run(command, input=archive(FILES), cwd=ROOT, capture_output=True)
            self.assertEqual(good.returncode, 0, good.stderr)
            actual = {p.relative_to(directory).as_posix() for p in Path(directory).rglob('*') if p.is_file()}
            self.assertEqual(actual, set(FILES) | {'.deploy.lock'})
            for names, link in (
                ((*FILES, '../escape'), None),
                ((*FILES, '/absolute'), None),
                ((*FILES, '_astro/../escape.css'), None),
                ((*FILES, '_astro/run.js'), None),
                ((*FILES, 'index.html'), None),
                (FILES[1:], None),
                (FILES, '_astro/layout.abc123.css'),
            ):
                with self.subTest(names=names, link=link):
                    bad = subprocess.run(command, input=archive(names, link), cwd=ROOT, capture_output=True)
                    self.assertNotEqual(bad.returncode, 0)
                    self.assertEqual((Path(directory) / 'index.html').read_bytes(), b'test')


if __name__ == '__main__':
    unittest.main()
