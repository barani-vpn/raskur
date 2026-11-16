import type { Lang, Link, Lines } from './site';

type Row = { term: string; text: string };
type Item = { title: string; text: string };
type Content = {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  announcement: { text: string };
  hero: { eyebrow: string; title: Lines; lede: string; primary: Link; note: string };
  facts: Row[];
  purpose: { eyebrow: string; title: string; paragraphs: string[] };
  areas: { eyebrow: string; title: string; text: string; tag: string; items: Item[] };
  audience: { eyebrow: string; title: string; text: string; rows: Row[] };
  process: { eyebrow: string; title: string; text: string; items: Item[] };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
};

export const grants: Record<Lang, Content> = {
  ru: {
    meta: {
      title: 'Образовательные гранты Додо Раскур · программа в разработке',
      description: 'Додо Раскур разрабатывает программу грантов для молодых людей, поступающих в университет. Приём заявок не открыт; условия, финансирование и партнёры не объявлены.',
      ogTitle: 'Образовательные гранты Додо Раскур',
      ogDescription: 'Программа в разработке для молодых людей, поступающих в университет. Приём заявок не открыт.',
    },
    announcement: { text: 'Программа в разработке. Приём заявок не открыт. Условия, финансирование и партнёрства с университетами не объявлены.' },
    hero: {
      eyebrow: 'Образовательные гранты',
      title: 'Поддержка на пути к университету.',
      lede: 'Додо Раскур разрабатывает программу грантов для молодых людей, поступающих в университет. Цель программы: помочь с подготовкой к поступлению и началом обучения. Здесь представлен планируемый формат; условия будут опубликованы до открытия заявок.',
      primary: { label: 'Описание программы', href: '#outline' },
      note: 'Статус программы: в разработке',
    },
    facts: [
      { term: 'Статус', text: 'В разработке' },
      { term: 'Приём заявок', text: 'Не открыт' },
      { term: 'Финансирование и условия', text: 'Не объявлены' },
      { term: 'Университеты-партнёры', text: 'Не объявлены' },
    ],
    purpose: {
      eyebrow: 'Цель программы',
      title: 'Доступ к высшему образованию',
      paragraphs: [
        'Переход из школы в университет — момент, когда доступ к инструментам, наставничеству и времени часто определяет, что студент построит дальше.',
        'Додо Раскур занимается инфраструктурой, в том числе облачной платформой, которая сама находится в разработке. Образовательная программа должна продолжить эту работу для тех, кто только начинает учёбу.',
        'Программа находится на этапе проектирования. Окончательные формы поддержки и правила отбора будут опубликованы перед началом набора.',
      ],
    },
    areas: {
      eyebrow: 'Описание программы',
      title: 'Планируемые направления поддержки',
      text: 'Направления находятся на рассмотрении. Состав, масштаб и доступность будут подтверждены к запуску и могут измениться.',
      tag: 'Рассматривается',
      items: [
        { title: 'Поддержка поступления', text: 'Рассматриваем грантовую помощь с расходами на подготовку, вступительные испытания и начало обучения. Размеры и допустимые расходы пока не определены.' },
        { title: 'Учебные материалы', text: 'Подобранные материалы и техническая документация для перехода к университетским курсам.' },
        { title: 'Наставничество', text: 'Консультации инженеров и исследователей по выбору направления, проектам и первым карьерным вопросам.' },
        { title: 'Учебная инфраструктура', text: 'Планируем доступ к вычислениям и хранилищам для учебных проектов после запуска облачной платформы.' },
      ],
    },
    audience: {
      eyebrow: 'Целевая аудитория',
      title: 'Для кого предназначена программа',
      text: 'Критерии предварительные и будут опубликованы вместе с объявлением о приёме заявок.',
      rows: [
        { term: 'Поступающие в университет', text: 'Те, кто готовится начать обучение по программе бакалавриата или учится на первом курсе.' },
        { term: 'Образовательная цель', text: 'Понятный план обучения и обоснование выбранного направления. Список поддерживаемых программ пока не установлен.' },
        { term: 'Подтверждённый интерес', text: 'Свидетельства устойчивого интереса: проекты, учебные работы, открытый вклад. Формальные результаты не должны быть единственным критерием.' },
        { term: 'Потребность в поддержке', text: 'Учёт того, где поддержка сильнее всего повлияет на возможность начать и продолжить обучение.' },
      ],
    },
    process: {
      eyebrow: 'Отбор',
      title: 'Предлагаемый порядок отбора',
      text: 'Это предложение. Итоговый процесс будет опубликован до открытия приёма заявок.',
      items: [
        { title: 'Объявление', text: 'На этой странице публикуются условия программы, критерии, сроки и доступные формы поддержки.' },
        { title: 'Подача заявки', text: 'Короткая заявка принимается в установленный период; необходимые сведения перечислены заранее.' },
        { title: 'Рассмотрение', text: 'Заявки оцениваются экспертной комиссией по опубликованным критериям.' },
        { title: 'Решение', text: 'Заявители получают результат и информацию о следующих шагах в заранее указанный срок.' },
        { title: 'Подключение', text: 'Отобранные участники получают доступ к направлениям поддержки, подтверждённым для этого набора.' },
      ],
    },
    faq: {
      eyebrow: 'Вопросы',
      title: 'Часто задаваемые вопросы',
      items: [
        { q: 'Можно ли подать заявку сейчас?', a: 'Нет. Приём заявок не открыт, формы заявки пока не существует. Страница будет обновлена, когда это изменится.' },
        { q: 'Каков будет объём финансирования?', a: 'Не объявлен. Размер финансирования, форма поддержки и число мест не определены.' },
        { q: 'Какие университеты участвуют?', a: 'Пока не объявлено. Эта страница не подразумевает партнёрства с каким-либо университетом.' },
        { q: 'Гарантирует ли программа поступление?', a: 'Нет. Программа не является сервисом по поступлению и не влияет на решения университетов.' },
        { q: 'Как узнать о запуске?', a: 'Объявления будут публиковаться на этой странице. Додо Раскур не собирает здесь контактные данные.' },
        { q: 'Связана ли программа с облаком Додо Раскур?', a: 'Облачная платформа — отдельный проект, который тоже находится в разработке. Поддержка инфраструктурой зависела бы от её готовности.' },
      ],
    },
  },
  en: {
    meta: {
      title: 'Dodo Raskur education grants · programme in development',
      description: 'Dodo Raskur is developing a grants programme for students entering university. Applications are not open; terms, funding and partnerships have not been announced.',
      ogTitle: 'Dodo Raskur education grants',
      ogDescription: 'A programme in development for students entering university. Applications are not open.',
    },
    announcement: { text: 'Programme in development. Applications are not open. Terms, funding and university partnerships have not been announced.' },
    hero: {
      eyebrow: 'Education grants',
      title: 'Supporting the next step towards university.',
      lede: 'Dodo Raskur is developing a grants programme for young people entering university. Its aim is to support preparation, applications and the start of study. This page sets out the proposed scope; terms will be published before applications open.',
      primary: { label: 'Explore the programme', href: '#outline' },
      note: 'Programme status: in development',
    },
    facts: [
      { term: 'Status', text: 'In development' },
      { term: 'Applications', text: 'Not open' },
      { term: 'Funding and terms', text: 'Not announced' },
      { term: 'University partners', text: 'Not announced' },
    ],
    purpose: {
      eyebrow: 'Programme purpose',
      title: 'Access to higher education',
      paragraphs: [
        'The transition from school to university is where access to tools, guidance and time often decides what a student goes on to build.',
        'Dodo Raskur works on infrastructure, including a cloud platform that is itself in development. The education grants programme is intended to extend that work to people at the start of their studies.',
        'The programme is being designed. Final support packages and selection criteria will be published before the first application round.',
      ],
    },
    areas: {
      eyebrow: 'Programme outline',
      title: 'Planned support areas',
      text: 'Areas under consideration. Scope, scale and availability will be confirmed at launch and may change.',
      tag: 'Under consideration',
      items: [
        { title: 'University-entry support', text: 'We are considering grants towards preparation, entrance assessments and the start of study. Funding amounts and eligible expenses have not been set.' },
        { title: 'Learning resources', text: 'Curated study materials and technical documentation for the transition into university-level courses.' },
        { title: 'Mentoring', text: 'Guidance from engineers and researchers on study choices, projects and early career questions.' },
        { title: 'Learning infrastructure', text: 'Planned access to compute and storage for educational projects once the cloud platform is available.' },
      ],
    },
    audience: {
      eyebrow: 'Intended audience',
      title: 'Who the programme is intended for',
      text: 'Criteria are provisional and will be published together with the call for applications.',
      rows: [
        { term: 'Students entering university', text: 'People preparing to start, or in the first year of, an undergraduate programme.' },
        { term: 'Educational goals', text: 'A clear study plan and an explanation of the chosen subject. Eligible degree programmes have not yet been defined.' },
        { term: 'Demonstrated interest', text: 'Evidence of sustained curiosity, such as projects, coursework or open contributions. Formal results are not expected to be the only measure.' },
        { term: 'Access needs', text: 'Consideration of where support would make the most difference to a student’s ability to begin and continue studying.' },
      ],
    },
    process: {
      eyebrow: 'Selection',
      title: 'Proposed selection process',
      text: 'This is a proposal. The final process will be published before applications open.',
      items: [
        { title: 'Announcement', text: 'Programme terms, eligibility, timeline and available support are published on this page.' },
        { title: 'Application', text: 'A short application is opened for a defined period, with the required information listed in advance.' },
        { title: 'Review', text: 'Applications are assessed against published criteria by a review panel.' },
        { title: 'Decision', text: 'Applicants are notified of outcomes and next steps within a stated timeframe.' },
        { title: 'Onboarding', text: 'Selected participants receive access to the support areas confirmed for that round.' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        { q: 'Can I apply now?', a: 'No. Applications are not open and no application form exists yet. This page will be updated when that changes.' },
        { q: 'How much funding will be available?', a: 'Not announced. Funding, the form of support and the number of places have not been decided.' },
        { q: 'Which universities are involved?', a: 'None have been announced. No university partnership is implied by this page.' },
        { q: 'Does the programme guarantee admission to a university?', a: 'No. The programme is not an admissions service and does not influence university decisions.' },
        { q: 'How will I find out when it launches?', a: 'Announcements will be published on this page. Dodo Raskur does not collect contact details here.' },
        { q: 'Is this connected to the Dodo Raskur cloud?', a: 'The cloud platform is a separate project that is also in development. Infrastructure support would depend on its availability.' },
      ],
    },
  },
};
