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
from scripts.receive_cloud import FILES, CSS, BINARY

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    'index.html': ('ru', 'https://cloud.raskur.tech/', '/en/'),
    'en/index.html': ('en', 'https://cloud.raskur.tech/en/', '/'),
    'frontdoor/index.html': ('ru', 'https://raskur.tech/', '/en/'),
    'frontdoor/en/index.html': ('en', 'https://raskur.tech/en/', '/'),
    'frontdoor/grants/index.html': ('ru', 'https://raskur.tech/grants/', '/en/grants/'),
    'frontdoor/en/grants/index.html': ('en', 'https://raskur.tech/en/grants/', '/grants/'),
    'register/index.html': ('ru', 'https://cloud.raskur.tech/register/', '/en/register/'),
    'en/register/index.html': ('en', 'https://cloud.raskur.tech/en/register/', '/register/'),
    'frontdoor/grants/register/index.html': ('ru', 'https://raskur.tech/grants/register/', '/en/grants/register/'),
    'frontdoor/en/grants/register/index.html': ('en', 'https://raskur.tech/en/grants/register/', '/grants/register/'),
}
RECEIPTS = {f'registration-receipt/{kind}/{lang}/index.html' for kind in ('cloud', 'edu') for lang in ('ru', 'en')}


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements, self.text = [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def handle_data(self, data):
        self.text.append(data)


REGISTRATIONS = {
    'register/index.html': ('cloud', 'ru'),
    'en/register/index.html': ('cloud', 'en'),
    'frontdoor/grants/register/index.html': ('edu', 'ru'),
    'frontdoor/en/grants/register/index.html': ('edu', 'en'),
}


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
        self.assertEqual(pages, set(PAGES) | RECEIPTS)
        for filename, (lang, canonical, other) in PAGES.items():
            with self.subTest(page=filename):
                html = (self.out / filename).read_text()
                page = Page(html)
                elements = page.elements
                self.assertTrue(any(tag == 'html' and attrs.get('lang') == lang for tag, attrs in elements))
                self.assertEqual(sum(tag == 'h1' for tag, _ in elements), 1)
                note = 'независимьій проект' if lang == 'ru' else 'independent project'
                self.assertIsNotNone(re.search(rf'<div class="wrap footer-note"[^>]*>{re.escape(note)}</div>', html), f'{filename}: footer must contain only the independent-project note')
                self.assertTrue(any(tag == 'link' and a.get('rel') == 'canonical' and a.get('href') == canonical for tag, a in elements))
                self.assertTrue(any(tag == 'a' and a.get('hreflang') and urlsplit(a.get('href', '')).path == other for tag, a in elements))
                self.assertFalse({'script', 'iframe'} & {tag for tag, _ in elements})
                self.assertEqual(sum(tag == 'form' for tag, _ in elements), int(filename in REGISTRATIONS))
                ids = [a['id'] for _, a in elements if 'id' in a]
                self.assertEqual(len(ids), len(set(ids)))
                styles = [a['href'] for tag, a in elements if tag == 'link' and a.get('rel') == 'stylesheet']
                self.assertTrue(styles)
                for href in styles:
                    self.assertRegex(urlsplit(href).path, r'^/_astro/[\w.-]+\.css$')
                for tag, a in elements:
                    href = a.get('href', '')
                    if tag == 'a':
                        self.assertNotEqual(urlsplit(href).hostname, 'github.com')
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
                    self.assertNotRegex(attrs.get('href', ''), r'(?i)(?:^|[/#?=])(checkout|payment)(?:[/?#=&]|$)')
            if filename in ('index.html', 'en/index.html'):
                for name in ('EC2', 'S3', 'EFS', 'Kubernetes', 'PostgreSQL', 'ClickHouse'):
                    self.assertIn(name, text)
                products = [a for tag, a in page.elements if tag == 'article' and 'product' in a.get('class', '').split()]
                self.assertEqual(len(products), 6)
            if filename in ('frontdoor/grants/index.html', 'frontdoor/en/grants/index.html'):
                for term in ('Raskur Scholars', 'Admission Track', 'Study Grant', '€20 000'):
                    self.assertIn(term, text)
                self.assertIn('ведущие университеты Европы' if lang == 'ru' else 'leading European universities', text)
                self.assertIn('не гарантирует поступление' if lang == 'ru' else 'does not guarantee admission', text)
                self.assertNotIn('simulator', text.lower())

    def test_registration_forms(self):
        for filename, (kind, lang) in REGISTRATIONS.items():
            with self.subTest(page=filename):
                self.assertTrue((self.out / filename).is_file(), 'registration route missing')
                page = Page((self.out / filename).read_text())
                forms = [a for tag, a in page.elements if tag == 'form']
                self.assertEqual(len(forms), 1)
                self.assertEqual(forms[0].get('method'), 'post')
                self.assertEqual(forms[0].get('action'), f'/api/registrations/{kind}')
                controls = {a['name']: a for tag, a in page.elements if tag in ('input', 'select', 'textarea')}
                expected = {'lang', 'name', 'email', 'consent', 'website', 'message', 'timeline'}
                expected |= {'company', 'company_size', 'industry', 'country', 'company_url', 'role', 'service'} if kind == 'cloud' else {'country', 'age', 'stage', 'subject', 'support'}
                self.assertEqual(set(controls), expected)
                self.assertEqual(controls['lang']['value'], lang)
                self.assertEqual(controls['email']['type'], 'email')
                if kind == 'cloud':
                    for name in ('company_size', 'industry', 'country'):
                        self.assertIn('required', controls[name])
                    self.assertEqual(controls['company_url']['type'], 'url')
                    self.assertNotIn('required', controls['company_url'])
                    self.assertEqual(controls['company_url']['maxlength'], '512')
                self.assertEqual(controls['consent']['type'], 'checkbox')
                self.assertIn('required', controls['consent'])
                self.assertNotIn('checked', controls['consent'])
                self.assertEqual(controls['message']['maxlength'], '1000')
                labels = {a['for'] for tag, a in page.elements if tag == 'label' and 'for' in a}
                for name, attrs in controls.items():
                    if attrs.get('type') != 'hidden':
                        self.assertIn(attrs.get('id'), labels, name)
                self.assertTrue(any(tag == 'details' and a.get('id') == 'privacy' for tag, a in page.elements))
                notice = re.search(r'<details id="privacy"[^>]*>(.*?)</details>', (self.out / filename).read_text(), re.S)
                assert notice is not None, 'privacy notice missing'
                privacy_text = ' '.join(Page(notice.group(1)).text)
                self.assertIn('GDPR', privacy_text)
                self.assertIn('ЕС' if lang == 'ru' else 'EU', privacy_text)
                self.assertNotRegex(privacy_text, r'(?i)Cloudflare|Poland|Польш|server|сервер')

    def test_cloud_request_to_join_copy(self):
        for lang, form in (('ru', 'register/index.html'), ('en', 'en/register/index.html')):
            for filename in (form, f'registration-receipt/cloud/{lang}/index.html'):
                page = Page((self.out / filename).read_text())
                copy = ' '.join(page.text) + ' '.join(a.get('content', '') for tag, a in page.elements if tag == 'meta')
                self.assertIn('Заявка на подключение' if lang == 'ru' else 'Request to join Raskur Cloud', copy)
                self.assertNotIn('не создаёт аккаунт', copy)
                self.assertNotIn('does not create a sign-in account', copy)
                self.assertFalse(any('scope' in a.get('class', '').split() for _, a in page.elements))

    def test_receipt_templates(self):
        for filename in RECEIPTS:
            html = (self.out / filename).read_text()
            page = Page(html)
            self.assertEqual(sum(tag == 'h1' for tag, _ in page.elements), 1)
            self.assertIn('__REQUEST_ID__', html)
            self.assertIn('__REQUEST_STATE__', html)
            self.assertTrue(any(tag == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for tag, a in page.elements))
            forms = [a for tag, a in page.elements if tag == 'form']
            self.assertEqual(len(forms), 1)
            self.assertEqual(forms[0]['action'], '/api/registrations/withdraw')
            self.assertEqual(forms[0]['method'], 'post')
            self.assertEqual({a['name'] for tag, a in page.elements if tag == 'input'}, {'id', 'lang'})

    def test_bundle_and_actual_receiver(self):
        paths = {p.relative_to(self.out).as_posix() for p in self.out.rglob('*') if p.is_file()}
        self.assertTrue(FILES < paths)
        self.assertTrue(all(name in FILES or name == BINARY or CSS.fullmatch(name) for name in paths))
        self.assertIn(BINARY, paths)
        archive = Path(self.tmp.name) / 'site.tar.gz'
        package(self.out, archive)
        with tarfile.open(archive) as tar:
            self.assertEqual(set(tar.getnames()), paths)
        with tempfile.TemporaryDirectory() as target:
            result = subprocess.run([sys.executable, '-c',
                'from pathlib import Path; import scripts.receive_cloud as r; '
                'r.ROOT=Path(__import__("sys").argv[1]); '
                'r.BINARY_TARGET=r.ROOT.parent/(r.ROOT.name+"-api"); '
                'r.RESTART=["/usr/bin/true"]; r.main()', target],
                input=archive.read_bytes(), cwd=ROOT, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            for path in paths - {BINARY}:
                self.assertEqual((Path(target) / path).read_bytes(), (self.out / path).read_bytes())
            binary = Path(target).parent / (Path(target).name + '-api')
            self.assertEqual(binary.read_bytes(), (self.out / BINARY).read_bytes())
            binary.unlink()

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
