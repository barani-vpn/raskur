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
      description: 'Облачная платформа Додо Раскур: виртуальные машины, S3, файловое хранилище, Kubernetes, Managed PostgreSQL и Managed ClickHouse для приложений и данных.',
      ogDescription: 'Вычисления, хранилища, контейнеры и управляемые базы данных на платформе Додо Раскур Cloud.',
    },
    announcement: { text: 'Додо Раскур Cloud · Инфраструктура для приложений и данных', link: { label: 'Возможности платформы', href: '#availability' } },
    hero: {
      eyebrow: 'Raskur Cloud / Обзор платформы',
      title: 'Облачная платформа для приложений и данных.',
      lede: 'Запускайте приложения, храните данные и управляйте нагрузкой на одной платформе. От виртуальной машины до аналитического кластера: выбирайте нужные ресурсы, а эксплуатацию управляемых сервисов оставьте нам.',
      primary: { label: 'Корпоративный аккаунт', href: '/register/' },
      secondary: { label: 'Как устроена платформа', href: '#availability' },
      note: 'Виртуальные машины · Объектные и файловые хранилища · Контейнеры · Управляемые базы данных',
    },
    map: {
      caption: 'Архитектура сервисов',
      label: 'платформа',
      note: 'Общие проекты, приватные сети и управление доступом объединяют сервисы платформы.',
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
      text: 'Шесть сервисов для прикладной инфраструктуры. Используйте их отдельно или собирайте архитектуру под задачи команды.',
      tag: 'Cloud service',
      summary: 'Возможности сервиса',
      items: [
        { id: 'compute', icon: 'VM', title: 'Виртуальные машины', text: 'Вычислительные ресурсы для приложений, фоновых задач и собственных окружений.', detail: 'EC2-подобная модель: настройка vCPU и памяти, образы Linux, SSH-ключи и подключаемые диски. Приватные сети связывают виртуальные машины с базами данных и другими сервисами проекта.' },
        { id: 'storage', icon: 'S3', title: 'Объектное хранилище', text: 'S3-совместимое хранение файлов, артефактов и наборов данных вне жизненного цикла приложения.', detail: 'Работайте через S3 API и привычные SDK. Бакеты, политики доступа, версионирование и правила жизненного цикла помогают организовать хранение исходных данных и результатов обработки.' },
        { id: 'files', icon: 'FS', title: 'Файловое хранилище', text: 'Общая файловая система для задач, которым нужен доступ к одним и тем же файлам.', detail: 'Общее хранилище класса EFS с доступом по NFS. Подключайте файловую систему к виртуальным машинам и контейнерным нагрузкам без копирования данных между рабочими окружениями.' },
        { id: 'kubernetes', icon: 'K8s', title: 'Kubernetes', text: 'Управляемые кластеры для контейнерных приложений, сервисов и распределённых задач.', detail: 'Платформа обслуживает управляющий контур кластера. Команда выбирает группы рабочих узлов, развёртывает приложения стандартными инструментами Kubernetes и управляет обновлениями своих нагрузок.' },
        { id: 'databases', icon: 'PG', title: 'Managed PostgreSQL', text: 'Управляемая реляционная база данных для транзакций и прикладных сервисов.', detail: 'Резервное копирование, восстановление на момент времени, мониторинг и обслуживание входят в управление сервисом. Подключайте приложения стандартными драйверами PostgreSQL через приватную сеть.' },
        { id: 'clickhouse', icon: 'CH', title: 'Managed ClickHouse', text: 'Управляемая колоночная база данных для аналитических запросов и событийных данных.', detail: 'Храните события, стройте витрины и выполняйте аналитические SQL-запросы. Интеграция с объектным хранилищем связывает загрузку исходных данных, обработку и долгосрочный архив.' },
      ],
    },
    workloads: {
      eyebrow: 'Сценарии использования',
      title: ['От приложения', 'к данным.'],
      text: 'Собирайте инфраструктуру вокруг рабочей нагрузки. Вычисления, хранилища и базы данных сочетаются без изменения привычных инструментов разработки.',
      items: [
        { kicker: '01 / Приложения', title: 'Backend и API', text: 'Виртуальные машины или Kubernetes для выполнения кода, PostgreSQL для транзакционных данных и S3 для файлов.' },
        { kicker: '02 / Аналитика', title: 'События и отчётность', text: 'ClickHouse для аналитических запросов, объектное хранилище для исходных наборов данных и вычисления для обработки.' },
        { kicker: '03 / Разработка', title: 'Рабочие окружения', text: 'Вычисления для задач разработки, общие файловые системы для совместных данных и Kubernetes для контейнерных сервисов.' },
      ],
    },
    availability: {
      eyebrow: 'Устройство платформы',
      title: 'Одна среда. Чёткое разделение ответственности.',
      text: 'Вы управляете приложениями, данными и конфигурацией нагрузки. Мы обслуживаем инфраструктуру и управляемые компоненты: от кластерного контура до резервного копирования баз данных.',
      link: { label: 'Raskur Scholars для будущих исследователей', href: link('cloud', 'apex', '/grants/', 'ru') },
      rows: [
        { term: 'Организация ресурсов', text: 'Проекты, приватные сети и группы ресурсов для отдельных окружений' },
        { term: 'Управление доступом', text: 'Роли, сервисные учётные записи и ключи доступа' },
        { term: 'Эксплуатация', text: 'Метрики, журналы, резервные копии и окна обслуживания управляемых сервисов' },
        { term: 'Интеграции', text: 'S3 API, NFS, Kubernetes и стандартные SQL-клиенты' },
      ],
    },
    faq: {
      eyebrow: 'Вопросы и ответы',
      title: 'Перед началом работы',
      items: [
        { q: 'Что выбрать: виртуальную машину или Kubernetes?', a: 'Виртуальная машина подходит, когда нужен контроль над операционной системой и окружением. Kubernetes удобен для контейнерных сервисов, повторяемых развёртываний и управления несколькими нагрузками.' },
        { q: 'Это сервисы AWS?', a: 'Нет. Додо Раскур является самостоятельной платформой и не связан с AWS. EC2 и EFS обозначают знакомые модели сервисов, а S3 API позволяет использовать совместимые инструменты и библиотеки.' },
        { q: 'Как распределяется ответственность за базу данных?', a: 'Платформа обслуживает инфраструктуру, резервное копирование и системные компоненты управляемой базы. Команда отвечает за схему, запросы, данные и права доступа своего приложения.' },
      ],
    },
  },
  en: {
    meta: {
      title: 'Dodo Raskur Cloud | cloud infrastructure',
      description: 'Dodo Raskur Cloud: virtual machines, S3 storage, shared filesystems, Kubernetes, Managed PostgreSQL and Managed ClickHouse for applications and data.',
      ogDescription: 'Compute, storage, containers and managed databases on the Dodo Raskur Cloud platform.',
    },
    announcement: { text: 'Dodo Raskur Cloud · Infrastructure for applications and data', link: { label: 'Platform capabilities', href: '#availability' } },
    hero: {
      eyebrow: 'Raskur Cloud / Platform overview',
      title: 'Cloud infrastructure for applications and data.',
      lede: 'Run applications, store data and manage workloads on one platform. From a virtual machine to an analytics cluster: choose the resources you need and leave managed-service operations to us.',
      primary: { label: 'Enterprise account', href: '/en/register/' },
      secondary: { label: 'How the platform works', href: '#availability' },
      note: 'Virtual machines · Object and file storage · Containers · Managed databases',
    },
    map: {
      caption: 'Service architecture',
      label: 'platform',
      note: 'Shared projects, private networks and access management connect the platform services.',
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
      text: 'Six services for application infrastructure. Use them independently or combine them into an architecture that fits your team.',
      tag: 'Cloud service',
      summary: 'Service capabilities',
      items: [
        { id: 'compute', icon: 'VM', title: 'Virtual machines', text: 'Compute resources for applications, background jobs and custom environments.', detail: 'An EC2-style model with configurable vCPU and memory, Linux images, SSH keys and attached disks. Private networks connect virtual machines to databases and other project services.' },
        { id: 'storage', icon: 'S3', title: 'Object storage', text: 'S3-compatible storage for files, artefacts and datasets, independent of application lifecycles.', detail: 'Work through the S3 API and familiar SDKs. Buckets, access policies, versioning and lifecycle rules organise source data and processing results.' },
        { id: 'files', icon: 'FS', title: 'Shared file storage', text: 'A shared filesystem for workloads that need access to the same files.', detail: 'EFS-style shared storage with NFS access. Attach a filesystem to virtual machines and container workloads without copying data between working environments.' },
        { id: 'kubernetes', icon: 'K8s', title: 'Kubernetes', text: 'Managed clusters for containerised applications, services and distributed workloads.', detail: 'The platform maintains the cluster control plane. Your team selects worker-node pools, deploys applications with standard Kubernetes tooling and manages workload updates.' },
        { id: 'databases', icon: 'PG', title: 'Managed PostgreSQL', text: 'A managed relational database for transactions and application services.', detail: 'Backups, point-in-time recovery, monitoring and maintenance are part of the managed service. Connect applications through a private network using standard PostgreSQL drivers.' },
        { id: 'clickhouse', icon: 'CH', title: 'Managed ClickHouse', text: 'A managed column-oriented database for analytical queries and event data.', detail: 'Store events, build data marts and run analytical SQL queries. Object-storage integration connects source-data ingestion, processing and long-term archives.' },
      ],
    },
    workloads: {
      eyebrow: 'Use cases',
      title: ['From applications', 'to data.'],
      text: 'Build infrastructure around the workload. Combine compute, storage and databases while keeping your familiar development tools.',
      items: [
        { kicker: '01 / Applications', title: 'Backends and APIs', text: 'Virtual machines or Kubernetes to run code, PostgreSQL for transactional data and S3 for files.' },
        { kicker: '02 / Analytics', title: 'Events and reporting', text: 'ClickHouse for analytical queries, object storage for source datasets and compute for processing.' },
        { kicker: '03 / Development', title: 'Working environments', text: 'Compute for development tasks, shared filesystems for common data and Kubernetes for containerised services.' },
      ],
    },
    availability: {
      eyebrow: 'Platform operations',
      title: 'One environment. Clear responsibilities.',
      text: 'You manage applications, data and workload configuration. We maintain the infrastructure and managed components, from cluster control planes to database backups.',
      link: { label: 'Raskur Scholars for future researchers', href: link('cloud', 'apex', '/grants/', 'en') },
      rows: [
        { term: 'Resource organisation', text: 'Projects, private networks and resource groups for separate environments' },
        { term: 'Access management', text: 'Roles, service accounts and access keys' },
        { term: 'Operations', text: 'Metrics, logs, backups and managed-service maintenance windows' },
        { term: 'Integrations', text: 'S3 API, NFS, Kubernetes and standard SQL clients' },
      ],
    },
    faq: {
      eyebrow: 'Frequently asked questions',
      title: 'Before you get started',
      items: [
        { q: 'Should I use a virtual machine or Kubernetes?', a: 'Choose a virtual machine when you need control over the operating system and environment. Kubernetes suits containerised services, repeatable deployments and the coordination of multiple workloads.' },
        { q: 'Are these AWS services?', a: 'No. Dodo Raskur is an independent platform and is not affiliated with AWS. EC2 and EFS describe familiar service models, while the S3 API lets you use compatible tools and libraries.' },
        { q: 'Who is responsible for a managed database?', a: 'The platform maintains infrastructure, backups and the database system components. Your team owns its schema, queries, data and application access permissions.' },
      ],
    },
  },
};
