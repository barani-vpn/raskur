export type Lang = 'ru' | 'en';
export type Site = 'cloud' | 'apex';
export type Link = { label: string; href: string };
export type Lines = string | string[];

export const origin = {
  cloud: 'https://cloud.raskur.tech',
  apex: 'https://raskur.tech',
  brand: 'https://brandbook.raskur.tech',
} as const;
export type Origin = keyof typeof origin;

export const langs: Lang[] = ['ru', 'en'];

export const publicPath = (path: string, lang: Lang) => (lang === 'en' ? '/en' : '') + path;
export const absolute = (to: Origin, path: string, lang: Lang) => origin[to] + publicPath(path, lang);
/** Root-relative inside the same public site, absolute across sites. */
export const link = (from: Site, to: Origin, path: string, lang: Lang) =>
  from === to ? publicPath(path, lang) : absolute(to, path, lang);

export const lines = (x: Lines) => (Array.isArray(x) ? x : [x]);

export const ui = {
  ru: { skip: 'К содержимому', brand: 'додо раскур', home: 'Додо Раскур, главная', main: 'Основная навигация', more: 'Дополнительная навигация', language: 'Язык' },
  en: { skip: 'Skip to content', brand: 'dodo raskur', home: 'Dodo Raskur, home', main: 'Main navigation', more: 'More information', language: 'Language' },
} as const;

const label = {
  ru: { cloud: 'Облачная платформа', education: 'Образование', brandbook: 'Брендбук', home: 'Главная', products: 'Продукты', usecases: 'Сценарии', availability: 'Доступность' },
  en: { cloud: 'Cloud platform', education: 'Education', brandbook: 'Brandbook', home: 'Home', products: 'Products', usecases: 'Use cases', availability: 'Availability' },
} as const;

const github = 'https://github.com/barani-vpn/raskur';

export const headerNav = (site: Site, lang: Lang): Link[] => {
  const l = label[lang];
  return site === 'cloud'
    ? [
        { label: l.products, href: '#products' },
        { label: l.usecases, href: '#workloads' },
        { label: l.education, href: absolute('apex', '/grants/', lang) },
        { label: l.availability, href: '#availability' },
      ]
    : [
        { label: l.cloud, href: absolute('cloud', '/', lang) },
        { label: l.education, href: publicPath('/grants/', lang) },
        { label: l.brandbook, href: absolute('brand', '/', lang) },
      ];
};

export const footer = (site: Site, lang: Lang): { links: Link[]; note: string } => {
  const l = label[lang];
  const note = {
    cloud: {
      ru: 'Додо Раскур · Платформа в разработке. Названия сторонних продуктов принадлежат их правообладателям.',
      en: 'Dodo Raskur · Platform in development. Third-party product names belong to their respective owners.',
    },
    apex: {
      ru: 'Независимый проект. Не связан с «Додо Пиццей». Информация о планируемых сервисах не является офертой.',
      en: 'An independent project, not affiliated with Dodo Pizza. Information about planned services is not an offer of service.',
    },
  }[site][lang];
  const links =
    site === 'cloud'
      ? [
          { label: l.home, href: absolute('apex', '/', lang) },
          { label: l.education, href: absolute('apex', '/grants/', lang) },
          { label: l.brandbook, href: absolute('brand', '/', lang) },
        ]
      : [
          { label: l.cloud, href: absolute('cloud', '/', lang) },
          { label: l.education, href: publicPath('/grants/', lang) },
          { label: l.brandbook, href: absolute('brand', '/', lang) },
          { label: 'GitHub', href: github },
        ];
  return { links, note };
};
