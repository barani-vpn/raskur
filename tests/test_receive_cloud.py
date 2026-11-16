import io
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
FILES = ('index.html', 'en/index.html', 'assets/cloud-coming.css', 'images/D.svg',
         'images/favicon32.png', 'images/og.jpg', 'fonts/Dodo_Rounded_v2-VF.woff2',
         'fonts/Pragmatica.ttf')


def archive(names):
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode='w:gz') as tar:
        for name in names:
            data = b'test'
            info = tarfile.TarInfo(name)
            info.size = len(data)
            tar.addfile(info, io.BytesIO(data))
    return buffer.getvalue()


class ReceiverTest(unittest.TestCase):
    def test_accepts_only_expected_files(self):
        with tempfile.TemporaryDirectory() as directory:
            command = [sys.executable, '-c',
                       'from pathlib import Path; import scripts.receive_cloud as r; '
                       'r.ROOT = Path(__import__("sys").argv[1]); r.main()', directory]
            good = subprocess.run(command, input=archive(FILES), cwd=ROOT, capture_output=True)
            self.assertEqual(good.returncode, 0, good.stderr)
            target = Path(directory, 'index.html')
            self.assertEqual(target.read_bytes(), b'test')
            bad = subprocess.run(command, input=archive((*FILES, '../escape')), cwd=ROOT, capture_output=True)
            self.assertNotEqual(bad.returncode, 0)
            self.assertEqual(target.read_bytes(), b'test')


if __name__ == '__main__':
    unittest.main()
