from html.parser import HTMLParser
import os
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import tempfile
import unittest
from urllib.parse import urlsplit

from scripts.build_cloud import build, package
from scripts.receive_cloud import FILES, CSS

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    'index.html': ('ru', 'https://cloud.raskur.tech/', '/en/'),
    'en/index.html': ('en', 'https://cloud.raskur.tech/en/', '/'),
    'frontdoor/index.html': ('ru', 'https://raskur.tech/', '/en/'),
    'frontdoor/en/index.html': ('en', 'https://raskur.tech/en/', '/'),
    'frontdoor/grants/index.html': ('ru', 'https://raskur.tech/grants/', '/en/grants/'),
    'frontdoor/en/grants/index.html': ('en', 'https://raskur.tech/en/grants/', '/grants/'),
}


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements, self.text = [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def handle_data(self, data):
        self.text.append(data)


class SitesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(os.environ.get('RASKUR_BUILD_DIR', Path(cls.tmp.name) / 'site'))
        if 'RASKUR_BUILD_DIR' not in os.environ:
            build(cls.out)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_routes_metadata_assets_and_links(self):
        pages = {p.relative_to(self.out).as_posix() for p in self.out.rglob('*.html')}
        self.assertEqual(pages, set(PAGES))
        for filename, (lang, canonical, other) in PAGES.items():
            with self.subTest(page=filename):
                page = Page((self.out / filename).read_text())
                elements = page.elements
                self.assertTrue(any(tag == 'html' and attrs.get('lang') == lang for tag, attrs in elements))
                self.assertEqual(sum(tag == 'h1' for tag, _ in elements), 1)
                self.assertTrue(any(tag == 'link' and a.get('rel') == 'canonical' and a.get('href') == canonical for tag, a in elements))
                self.assertTrue(any(tag == 'a' and a.get('hreflang') and urlsplit(a.get('href', '')).path == other for tag, a in elements))
                self.assertFalse({'script', 'iframe', 'form', 'input'} & {tag for tag, _ in elements})
                ids = [a['id'] for _, a in elements if 'id' in a]
                self.assertEqual(len(ids), len(set(ids)))
                styles = [a['href'] for tag, a in elements if tag == 'link' and a.get('rel') == 'stylesheet']
                self.assertTrue(styles)
                for href in styles:
                    self.assertRegex(urlsplit(href).path, r'^/_astro/[\w.-]+\.css$')
                for tag, a in elements:
                    href = a.get('href', '')
                    if href.startswith('#'):
                        self.assertIn(href[1:], ids)
                    source = a.get('src') or (href if tag == 'link' and a.get('rel') in ('stylesheet', 'icon', 'preload') else None)
                    if source and source.startswith('/'):
                        self.assertTrue((self.out / urlsplit(source).path.lstrip('/')).is_file(), source)

    def test_catalogue_and_scholars_programme(self):
        for filename, (lang, _, _) in PAGES.items():
            page = Page((self.out / filename).read_text())
            text = ' '.join(page.text)
            copy = (text + ' ' + ' '.join(a.get('content', '') for tag, a in page.elements if tag == 'meta')).lower()
            for stale in ('в разработке', 'планируется', 'не объявлены', 'программа готовится', 'вымышлен', 'демонстрацион', 'in development', 'to be announced', 'not open yet', 'in preparation', 'fictional', 'demonstration', 'coming soon', 'planned services'):
                self.assertFalse(stale in copy, f'{filename}: obsolete copy {stale!r}')
            for tag, attrs in page.elements:
                if tag == 'a':
                    self.assertNotRegex(attrs.get('href', ''), r'(?i)(?:^|[/#?=])(signup|sign-up|register|apply|checkout|payment)(?:[/?#=&]|$)')
            if filename in ('index.html', 'en/index.html'):
                for name in ('EC2', 'S3', 'EFS', 'Kubernetes', 'PostgreSQL', 'ClickHouse'):
                    self.assertIn(name, text)
                products = [a for tag, a in page.elements if tag == 'article' and 'product' in a.get('class', '').split()]
                self.assertEqual(len(products), 6)
            if '/grants/' in filename:
                for term in ('Raskur Scholars', 'Admission Track', 'Study Grant', '€20 000'):
                    self.assertIn(term, text)
                self.assertIn('ведущие университеты Европы' if lang == 'ru' else 'leading European universities', text)
                self.assertIn('не гарантирует поступление' if lang == 'ru' else 'does not guarantee admission', text)
                self.assertNotIn('simulator', text.lower())

    def test_bundle_and_actual_receiver(self):
        paths = {p.relative_to(self.out).as_posix() for p in self.out.rglob('*') if p.is_file()}
        self.assertTrue(FILES < paths)
        self.assertTrue(all(name in FILES or CSS.fullmatch(name) for name in paths))
        archive = Path(self.tmp.name) / 'site.tar.gz'
        package(self.out, archive)
        with tarfile.open(archive) as tar:
            self.assertEqual(set(tar.getnames()), paths)
        with tempfile.TemporaryDirectory() as target:
            result = subprocess.run([sys.executable, '-c',
                'from pathlib import Path; import scripts.receive_cloud as r; '
                'r.ROOT=Path(__import__("sys").argv[1]); r.main()', target],
                input=archive.read_bytes(), cwd=ROOT, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            for path in paths:
                self.assertEqual((Path(target) / path).read_bytes(), (self.out / path).read_bytes())

    def test_packaging_rejects_unsafe_destinations(self):
        with self.assertRaises(ValueError):
            package(self.out, self.out / 'site.tar.gz')
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'link').symlink_to(self.out / 'index.html')
            with self.assertRaises(ValueError):
                package(root, Path(self.tmp.name) / 'invalid.tar.gz')
        with self.assertRaises(ValueError):
            build(self.out)


if __name__ == '__main__':
    unittest.main()
