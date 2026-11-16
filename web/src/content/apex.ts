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
      description: 'Додо Раскур: облачная инфраструктура в разработке и образовательная программа в подготовке. Платформа, направления и материалы бренда.',
      ogDescription: 'Облачная платформа, образовательная инициатива и материалы Додо Раскура.',
    },
    announcement: { text: 'Додо Раскур · технологии и образование', link: { label: 'Статус облачной платформы', href: cloudAt('ru', '#availability') } },
    hero: {
      eyebrow: 'Додо Раскур',
      title: ['Облачная инфраструктура.', 'Новые возможности.'],
      lede: 'Разрабатываем платформу для приложений и данных. Готовим образовательную программу для молодых людей, которые делают следующий шаг к университету.',
      primary: { label: 'Облачная платформа', href: cloudAt('ru') },
      secondary: { label: 'Образовательная программа', href: publicPath('/grants/', 'ru') },
      note: 'Платформа и программа находятся в разработке. Публичный доступ и приём заявок ещё не открыты.',
    },
    directory: {
      aria: 'Направления Додо Раскура',
      eyebrow: 'Направления',
      items: [
        { title: 'Cloud', text: 'Инфраструктура для приложений и данных', status: 'В разработке', href: cloudAt('ru') },
        { title: 'Education', text: 'Поддержка перехода к высшему образованию', status: 'Программа готовится', href: publicPath('/grants/', 'ru') },
        { title: 'Brand', text: 'Идентичность, принципы и материалы бренда', status: 'Открытый брендбук', href: absolute('brand', '/', 'ru') },
      ],
    },
    platform: {
      eyebrow: 'Облачная платформа',
      title: ['Вычисления, хранилища', 'и управляемые данные.'],
      text: 'Планируем сервисы для запуска приложений, работы с файлами и обработки данных. Технические характеристики будут опубликованы до открытия доступа.',
      services: services('ru', ['Виртуальные машины', 'S3-хранилище', 'Файловые системы', 'Kubernetes', 'Managed PostgreSQL', 'Managed ClickHouse']),
    },
    education: {
      eyebrow: 'Образовательная инициатива',
      title: ['Следующий шаг', 'к университету.'],
      text: 'Готовим программу поддержки молодых людей на пути к высшему образованию. Направления, предполагаемый процесс отбора и текущий статус собраны на странице программы.',
      cta: { label: 'О программе', href: publicPath('/grants/', 'ru') },
    },
  },
  en: {
    meta: {
      title: 'Dodo Raskur | infrastructure and education programmes',
      description: 'Dodo Raskur: cloud infrastructure in development and an education programme in preparation. Explore the platform, programmes and brand resources.',
      ogDescription: 'The cloud platform, education initiative and brand resources from Dodo Raskur.',
    },
    announcement: { text: 'Dodo Raskur · technology and education', link: { label: 'Cloud platform status', href: cloudAt('en', '#availability') } },
    hero: {
      eyebrow: 'Dodo Raskur',
      title: ['Cloud infrastructure.', 'New possibilities.'],
      lede: 'Developing a platform for applications and data. Preparing an education programme for young people taking their next step towards university.',
      primary: { label: 'Cloud platform', href: cloudAt('en') },
      secondary: { label: 'Education programme', href: publicPath('/grants/', 'en') },
      note: 'The platform and programme are in development. Public access and applications are not open yet.',
    },
    directory: {
      aria: 'Dodo Raskur initiatives',
      eyebrow: 'Explore Dodo Raskur',
      items: [
        { title: 'Cloud', text: 'Infrastructure for applications and data', status: 'In development', href: cloudAt('en') },
        { title: 'Education', text: 'Supporting the transition to higher education', status: 'Programme in preparation', href: publicPath('/grants/', 'en') },
        { title: 'Brand', text: 'Identity, principles and brand resources', status: 'Open brandbook', href: absolute('brand', '/', 'en') },
      ],
    },
    platform: {
      eyebrow: 'Cloud platform',
      title: ['Compute, storage', 'and managed data.'],
      text: 'We plan to offer services for running applications, working with files and processing data. Technical specifications will be published before access opens.',
      services: services('en', ['Virtual machines', 'S3 storage', 'Shared filesystems', 'Kubernetes', 'Managed PostgreSQL', 'Managed ClickHouse']),
    },
    education: {
      eyebrow: 'Education initiative',
      title: ['The next step', 'towards university.'],
      text: 'We are preparing a programme to support young people on their path to higher education. Explore its proposed focus, selection process and current status.',
      cta: { label: 'About the programme', href: publicPath('/grants/', 'en') },
    },
  },
};
