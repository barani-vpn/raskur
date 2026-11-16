import { absolute, publicPath, type Lang, type Link, type Lines } from './site';

type Content = {
  meta: { title: string; description: string; ogDescription: string };
  announcement: { text: string; link: Link };
  hero: { eyebrow: string; title: Lines; lede: string; primary: Link; secondary: Link; note: string };
  directory: { aria: string; eyebrow: string; items: { title: string; text: string; status: string; href: string }[] };
  platform: { eyebrow: string; title: Lines; text: string; services: Link[] };
  education: { eyebrow: string; title: Lines; text: string; cta: Link };
};

const cloudAt = (lang: Lang, anchor = '') => absolute('cloud', '/', lang) + anchor;
const services = (lang: Lang, names: string[]): Link[] =>
  ['compute', 'storage', 'files', 'kubernetes', 'databases', 'clickhouse'].map((id, i) => ({ label: names[i], href: cloudAt(lang, '#' + id) }));

export const apex: Record<Lang, Content> = {
  ru: {
    meta: {
      title: 'Додо Раскур | инфраструктура и образовательные программы',
      description: 'Додо Раскур: облачная инфраструктура для приложений и данных, образовательная программа Raskur Scholars и поддержка поступления в ведущие университеты Европы.',
      ogDescription: 'Облачная платформа, образовательная инициатива и материалы Додо Раскура.',
    },
    announcement: { text: 'Додо Раскур · технологии и образование', link: { label: 'Возможности облачной платформы', href: cloudAt('ru', '#availability') } },
    hero: {
      eyebrow: 'Додо Раскур',
      title: ['Облачная инфраструктура.', 'Новые возможности.'],
      lede: 'Обеспечиваем команды инфраструктурой для приложений и данных. Помогаем молодым людям поступать в ведущие университеты Европы через программу Raskur Scholars.',
      primary: { label: 'Облачная платформа', href: cloudAt('ru') },
      secondary: { label: 'Образовательная программа', href: publicPath('/grants/', 'ru') },
      note: 'Облачные сервисы для команд. Образовательные возможности для следующего поколения.',
    },
    directory: {
      aria: 'Направления Додо Раскура',
      eyebrow: 'Направления',
      items: [
        { title: 'Cloud', text: 'Инфраструктура для приложений и данных', status: 'Облачная платформа', href: cloudAt('ru') },
        { title: 'Education', text: 'Поступление в ведущие университеты Европы', status: 'Raskur Scholars', href: publicPath('/grants/', 'ru') },
        { title: 'Brand', text: 'Идентичность, принципы и материалы бренда', status: 'Открытый брендбук', href: absolute('brand', '/', 'ru') },
      ],
    },
    platform: {
      eyebrow: 'Облачная платформа',
      title: ['Вычисления, хранилища', 'и управляемые данные.'],
      text: 'Запускайте приложения на виртуальных машинах и в Kubernetes, храните файлы и обрабатывайте данные. Управляемые PostgreSQL и ClickHouse снимают с команды повседневное обслуживание баз данных.',
      services: services('ru', ['Виртуальные машины', 'S3-хранилище', 'Файловые системы', 'Kubernetes', 'Managed PostgreSQL', 'Managed ClickHouse']),
    },
    education: {
      eyebrow: 'Raskur Scholars',
      title: ['Ваш потенциал.', 'Университеты Европы.'],
      text: 'Подготовка к поступлению, персональное наставничество и гранты до €20 000. Raskur Scholars сопровождает молодых людей от выбора европейского университета до первого семестра.',
      cta: { label: 'О программе', href: publicPath('/grants/', 'ru') },
    },
  },
  en: {
    meta: {
      title: 'Dodo Raskur | infrastructure and education programmes',
      description: 'Dodo Raskur: cloud infrastructure for applications and data, the Raskur Scholars education programme and support for admission to leading European universities.',
      ogDescription: 'The cloud platform, education initiative and brand resources from Dodo Raskur.',
    },
    announcement: { text: 'Dodo Raskur · technology and education', link: { label: 'Cloud platform capabilities', href: cloudAt('en', '#availability') } },
    hero: {
      eyebrow: 'Dodo Raskur',
      title: ['Cloud infrastructure.', 'New possibilities.'],
      lede: 'Infrastructure for teams building applications and working with data. Support for young people progressing to leading European universities through Raskur Scholars.',
      primary: { label: 'Cloud platform', href: cloudAt('en') },
      secondary: { label: 'Education programme', href: publicPath('/grants/', 'en') },
      note: 'Cloud services for teams. Educational opportunities for the next generation.',
    },
    directory: {
      aria: 'Dodo Raskur initiatives',
      eyebrow: 'Explore Dodo Raskur',
      items: [
        { title: 'Cloud', text: 'Infrastructure for applications and data', status: 'Cloud platform', href: cloudAt('en') },
        { title: 'Education', text: 'Access to leading European universities', status: 'Raskur Scholars', href: publicPath('/grants/', 'en') },
        { title: 'Brand', text: 'Identity, principles and brand resources', status: 'Open brandbook', href: absolute('brand', '/', 'en') },
      ],
    },
    platform: {
      eyebrow: 'Cloud platform',
      title: ['Compute, storage', 'and managed data.'],
      text: 'Run applications on virtual machines and Kubernetes, store files and process data. Managed PostgreSQL and ClickHouse take day-to-day database maintenance off your team’s hands.',
      services: services('en', ['Virtual machines', 'S3 storage', 'Shared filesystems', 'Kubernetes', 'Managed PostgreSQL', 'Managed ClickHouse']),
    },
    education: {
      eyebrow: 'Raskur Scholars',
      title: ['Your potential.', 'European universities.'],
      text: 'Admissions preparation, personal mentoring and grants of up to €20 000. Raskur Scholars supports young people from choosing a European university to their first semester.',
      cta: { label: 'About the programme', href: publicPath('/grants/', 'en') },
    },
  },
};
