import re
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import build_cloud as b

BRAND, CLOUD = b.BRAND, b.CLOUD
H1 = re.compile(r"<h1[^>]*>.*?</h1>", re.S)


class BuildCloud(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(cls.tmp.name)
        b.build(cls.out)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_assets_copied_and_previews_not(self):
        for a in b.ASSETS:
            self.assertEqual((self.out / a).read_bytes(), (b.ROOT / a).read_bytes(), a)
        self.assertFalse((self.out / "cloud.html").exists())
        self.assertFalse((self.out / "en/cloud.html").exists())

    def test_locales(self):
        cases = {
            "index.html": ("cloud.html", f"{CLOUD}/", "/en/", f"{BRAND}/"),
            "en/index.html": ("en/cloud.html", f"{CLOUD}/en/", "/", f"{BRAND}/en/"),
        }
        for dst, (src, canon, other, brand) in cases.items():
            with self.subTest(dst):
                html = (self.out / dst).read_text(encoding="utf-8")
                orig = (b.ROOT / src).read_text(encoding="utf-8")
                self.assertIn(f'rel="canonical" href="{canon}"', html)
                self.assertIn(f'og:url" content="{canon}"', html)
                self.assertIn(f'hreflang="ru" href="{CLOUD}/"', html)
                self.assertIn(f'hreflang="en" href="{CLOUD}/en/"', html)
                self.assertIn(f'<a href="{other}" hreflang=', html)
                self.assertIn(f'class="brand" href="{brand}"', html)
                self.assertIn(f'class="btn" href="{brand}"', html)
                self.assertNotIn("cloud.html", html)
                self.assertEqual(H1.findall(html), H1.findall(orig))
                self.assertEqual(len(H1.findall(html)), 1)


if __name__ == "__main__":
    unittest.main()
