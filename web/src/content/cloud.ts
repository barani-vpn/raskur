import { link, type Lang, type Link, type Lines } from './site';

type Faq = { q: string; a: string }[];
type Content = {
  meta: { title: string; description: string; ogDescription: string };
  announcement: { text: string; link: Link };
  hero: { eyebrow: string; title: Lines; lede: string; primary: Link; secondary: Link; note: string };
  map: { caption: string; label: string; note: string; layers: { title: string; text: string; symbol: string }[] };
  categories: { aria: string; items: Link[] };
  products: { eyebrow: string; title: string; text: string; tag: string; summary: string; items: { id: string; icon: string; title: string; text: string; detail: string }[] };
  workloads: { eyebrow: string; title: Lines; text: string; items: { kicker: string; title: string; text: string }[] };
  availability: { eyebrow: string; title: string; text: string; link: Link; rows: { term: string; text: string }[] };
  faq: { eyebrow: string; title: string; items: Faq };
};

export const cloud: Record<Lang, Content> = {
  ru: {
    meta: {
      title: 'Додо Раскур Cloud | облачная платформа',
      description: 'Планируемая облачная платформа Додо Раскур: виртуальные машины, S3, файловое хранилище, Kubernetes, PostgreSQL и ClickHouse. В разработке.',
      ogDescription: 'Инфраструктура для приложений и данных. Знакомьтесь с планируемой платформой Додо Раскур.',
    },
    announcement: { text: 'Додо Раскур Cloud · платформа в разработке', link: { label: 'Информация о запуске', href: '#availability' } },
    hero: {
      eyebrow: 'Raskur Cloud / Обзор платформы',
      title: 'Облачная платформа для приложений и данных.',
      lede: 'Вычисления, хранилища, контейнеры и управляемые базы данных. Проектируем инфраструктуру, на которой команды смогут запускать свои сервисы.',
      primary: { label: 'Изучить платформу', href: '#products' },
      secondary: { label: 'Статус разработки', href: '#availability' },
      note: 'Сервисы пока недоступны. Конфигурации, регионы и цены будут опубликованы отдельно.',
    },
    map: {
      caption: 'Архитектура сервисов',
      label: 'концепция',
      note: 'Планируемый состав платформы, не схема работающей инфраструктуры.',
      layers: [
        { title: 'Вычисления', text: 'Виртуальные машины · Kubernetes', symbol: '⌘' },
        { title: 'Хранилища', text: 'Объекты S3 · Общие файловые системы', symbol: '▤' },
        { title: 'Управляемые данные', text: 'PostgreSQL · ClickHouse', symbol: '⊞' },
      ],
    },
    categories: {
      aria: 'Категории продуктов',
      items: [
        { label: 'Вычисления', href: '#compute' },
        { label: 'Хранилища', href: '#storage' },
        { label: 'Контейнеры', href: '#kubernetes' },
        { label: 'Базы данных', href: '#databases' },
      ],
    },
    products: {
      eyebrow: 'Продуктовый каталог',
      title: 'Что мы раскуриваем',
      text: 'Шесть направлений одной платформы. Это план разработки, а не предложение доступных услуг.',
      tag: 'Планируется',
      summary: 'Назначение сервиса',
      items: [
        { id: 'compute', icon: 'VM', title: 'Виртуальные машины', text: 'Вычислительные ресурсы для приложений, фоновых задач и собственных окружений.', detail: 'Модель виртуальных машин, аналогичная EC2. Типы инстансов и лимиты ресурсов будут определены до запуска.' },
        { id: 'storage', icon: 'S3', title: 'Объектное хранилище', text: 'S3-совместимое хранение файлов, артефактов и наборов данных вне жизненного цикла приложения.', detail: 'Планируем работу через S3 API. Классы хранения, квоты и условия передачи данных пока не объявлены.' },
        { id: 'files', icon: 'FS', title: 'Файловое хранилище', text: 'Общая файловая система для задач, которым нужен доступ к одним и тем же файлам.', detail: 'Сервис класса EFS. Протоколы доступа, производительность и способы подключения будут опубликованы в спецификации.' },
        { id: 'kubernetes', icon: 'K8s', title: 'Kubernetes', text: 'Среда для контейнерных приложений, сервисов и распределённых задач.', detail: 'Планируем Kubernetes в составе платформы. Версии, варианты кластеров и границы ответственности команды будут описаны до открытия доступа.' },
        { id: 'databases', icon: 'PG', title: 'Managed PostgreSQL', text: 'Управляемая реляционная база данных для транзакций и прикладных сервисов.', detail: 'Планируем управляемый PostgreSQL. Поддерживаемые версии, резервное копирование и параметры отказоустойчивости ещё не опубликованы.' },
        { id: 'clickhouse', icon: 'CH', title: 'Managed ClickHouse', text: 'Управляемая колоночная база данных для аналитических запросов и событийных данных.', detail: 'Планируем управляемый ClickHouse. Топологии, лимиты и условия эксплуатации будут описаны в документации сервиса.' },
      ],
    },
    workloads: {
      eyebrow: 'Сценарии использования',
      title: ['От приложения', 'к данным.'],
      text: 'Намечаем продуктовый состав вокруг задач команд. Ниже показано, как сервисы могут сочетаться после запуска.',
      items: [
        { kicker: '01 / Приложения', title: 'Backend и API', text: 'Виртуальные машины или Kubernetes для выполнения кода, PostgreSQL для транзакционных данных и S3 для файлов.' },
        { kicker: '02 / Аналитика', title: 'События и отчётность', text: 'ClickHouse для аналитических запросов, объектное хранилище для исходных наборов данных и вычисления для обработки.' },
        { kicker: '03 / Разработка', title: 'Рабочие окружения', text: 'Вычисления для задач разработки, общие файловые системы для совместных данных и Kubernetes для контейнерных сервисов.' },
      ],
    },
    availability: {
      eyebrow: 'Доступность платформы',
      title: 'В разработке.',
      text: 'Публичный доступ ещё не открыт. Мы не принимаем заказы на инфраструктуру и не публикуем неподтверждённые характеристики.',
      link: { label: 'Образовательная программа', href: link('cloud', 'apex', '/grants/', 'ru') },
      rows: [
        { term: 'Состав сервисов', text: 'ВМ, S3, файловое хранилище, Kubernetes, PostgreSQL, ClickHouse' },
        { term: 'Запуск и регионы', text: 'Будут объявлены' },
        { term: 'Тарифы и SLA', text: 'Будут опубликованы до открытия доступа' },
        { term: 'Документация и API', text: 'Спецификации пока не опубликованы' },
      ],
    },
    faq: {
      eyebrow: 'Вопросы и ответы',
      title: 'Перед началом работы',
      items: [
        { q: 'Можно ли уже создать ресурс?', a: 'Нет. Здесь представлен план платформы. Консоль и регистрация пока недоступны.' },
        { q: 'Это сервисы AWS?', a: 'Нет. EC2 и EFS используются как знакомые ориентиры типов сервисов. Додо Раскур не связан с AWS. Совместимость с S3 API заявлена как цель разработки.' },
        { q: 'Где следить за запуском?', a: 'Информация о доступе, регионах и условиях появится на этой странице. Формы сбора заявок пока нет.' },
      ],
    },
  },
  en: {
    meta: {
      title: 'Dodo Raskur Cloud | cloud infrastructure',
      description: 'The planned Dodo Raskur platform: virtual machines, S3 storage, shared filesystems, Kubernetes, PostgreSQL and ClickHouse. In development.',
      ogDescription: 'Infrastructure for applications and data. Explore the planned Dodo Raskur platform.',
    },
    announcement: { text: 'Dodo Raskur Cloud · platform in development', link: { label: 'Launch information', href: '#availability' } },
    hero: {
      eyebrow: 'Raskur Cloud / Platform overview',
      title: 'Cloud infrastructure for applications and data.',
      lede: 'Compute, storage, containers and managed databases. We are designing the infrastructure teams will use to run their services.',
      primary: { label: 'Explore the platform', href: '#products' },
      secondary: { label: 'Development status', href: '#availability' },
      note: 'Services are not available yet. Configurations, regions and pricing will be published separately.',
    },
    map: {
      caption: 'Service architecture',
      label: 'concept',
      note: 'Planned platform structure, not a diagram of running infrastructure.',
      layers: [
        { title: 'Compute', text: 'Virtual machines · Kubernetes', symbol: '⌘' },
        { title: 'Storage', text: 'S3 objects · Shared filesystems', symbol: '▤' },
        { title: 'Managed data', text: 'PostgreSQL · ClickHouse', symbol: '⊞' },
      ],
    },
    categories: {
      aria: 'Product categories',
      items: [
        { label: 'Compute', href: '#compute' },
        { label: 'Storage', href: '#storage' },
        { label: 'Containers', href: '#kubernetes' },
        { label: 'Databases', href: '#databases' },
      ],
    },
    products: {
      eyebrow: 'Product catalogue',
      title: 'The Raskur platform',
      text: 'Six service areas, one platform. This is our development plan, not a catalogue of available services.',
      tag: 'Planned',
      summary: 'Service scope',
      items: [
        { id: 'compute', icon: 'VM', title: 'Virtual machines', text: 'Compute resources for applications, background jobs and custom environments.', detail: 'A virtual-machine model comparable to EC2. Instance types and resource limits will be defined before launch.' },
        { id: 'storage', icon: 'S3', title: 'Object storage', text: 'S3-compatible storage for files, artefacts and datasets, independent of application lifecycles.', detail: 'We plan to support the S3 API. Storage classes, quotas and data-transfer terms have not been announced.' },
        { id: 'files', icon: 'FS', title: 'Shared file storage', text: 'A shared filesystem for workloads that need access to the same files.', detail: 'An EFS-style service. Access protocols, performance and connection options will be published in its specification.' },
        { id: 'kubernetes', icon: 'K8s', title: 'Kubernetes', text: 'An environment for containerised applications, services and distributed workloads.', detail: 'Kubernetes is part of the platform plan. Versions, cluster options and the division of operational responsibilities will be documented before access opens.' },
        { id: 'databases', icon: 'PG', title: 'Managed PostgreSQL', text: 'A managed relational database for transactions and application services.', detail: 'We plan to offer managed PostgreSQL. Supported versions, backup policies and availability options have not been published.' },
        { id: 'clickhouse', icon: 'CH', title: 'Managed ClickHouse', text: 'A managed column-oriented database for analytical queries and event data.', detail: 'We plan to offer managed ClickHouse. Topologies, limits and operating terms will be described in the service documentation.' },
      ],
    },
    workloads: {
      eyebrow: 'Use cases',
      title: ['From applications', 'to data.'],
      text: "We are shaping the product catalogue around teams' workloads. These examples show how the planned services could work together after launch.",
      items: [
        { kicker: '01 / Applications', title: 'Backends and APIs', text: 'Virtual machines or Kubernetes to run code, PostgreSQL for transactional data and S3 for files.' },
        { kicker: '02 / Analytics', title: 'Events and reporting', text: 'ClickHouse for analytical queries, object storage for source datasets and compute for processing.' },
        { kicker: '03 / Development', title: 'Working environments', text: 'Compute for development tasks, shared filesystems for common data and Kubernetes for containerised services.' },
      ],
    },
    availability: {
      eyebrow: 'Platform availability',
      title: 'In development.',
      text: 'Public access is not open. We are not accepting infrastructure orders or publishing unconfirmed specifications.',
      link: { label: 'Education programme', href: link('cloud', 'apex', '/grants/', 'en') },
      rows: [
        { term: 'Service scope', text: 'VMs, S3, shared filesystems, Kubernetes, PostgreSQL, ClickHouse' },
        { term: 'Launch and regions', text: 'To be announced' },
        { term: 'Pricing and SLAs', text: 'To be published before access opens' },
        { term: 'Documentation and APIs', text: 'Specifications are not yet published' },
      ],
    },
    faq: {
      eyebrow: 'Frequently asked questions',
      title: 'Before you get started',
      items: [
        { q: 'Can I create a resource today?', a: 'No. This site describes the planned platform. The console and registration are not available yet.' },
        { q: 'Are these AWS services?', a: 'No. EC2 and EFS are familiar reference points for the types of service. Dodo Raskur is not affiliated with AWS. S3 API compatibility is a development goal.' },
        { q: 'Where will launch information appear?', a: 'Access, regions and terms will be published on this page. There is no application form at this stage.' },
      ],
    },
  },
};
