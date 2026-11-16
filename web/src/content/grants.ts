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
      title: 'Raskur Scholars | поступление в ведущие университеты Европы',
      description: 'Raskur Scholars: подготовка к поступлению в ведущие университеты Европы, академическое наставничество и гранты до €20 000 на подготовку и первый год обучения.',
      ogTitle: 'Raskur Scholars | образование без границ',
      ogDescription: 'Поступление в ведущие университеты Европы: Admission Track, Study Grant и академическое наставничество Raskur Scholars.',
    },
    announcement: { text: 'Raskur Scholars · Подготовка к поступлению, образовательные гранты и академическое наставничество' },
    hero: {
      eyebrow: 'Raskur Scholars / European University Programme',
      title: 'Ваш потенциал. Ведущие университеты Европы.',
      lede: 'Помогаем молодым людям поступать в ведущие университеты Европы. От выбора программы и подготовки к экзаменам до финансирования первого года: один образовательный маршрут и персональный наставник на каждом этапе.',
      primary: { label: 'Изучить программу', href: '#outline' },
      note: 'Бакалавриат · Индивидуальная подготовка · Поддержка по академическому потенциалу и финансовой потребности',
    },
    facts: [
      { term: 'География', text: 'Европа' },
      { term: 'Участники', text: '16-24 года' },
      { term: 'Study Grant', text: 'До €20 000' },
      { term: 'Сопровождение', text: 'До 18 месяцев' },
    ],
    purpose: {
      eyebrow: 'Наша задача',
      title: 'Возможности должны зависеть от способностей.',
      paragraphs: [
        'Поступление в сильный университет требует не только знаний. Важны понимание требований, языковая подготовка, время на документы и средства на начало обучения. Raskur Scholars объединяет эту поддержку в одной программе.',
        'Мы работаем с индивидуальным профилем абитуриента: академическими интересами, проектами, образовательным контекстом и бюджетом. На этой основе формируется сбалансированный список университетов и календарь подготовки.',
        'Наша цель не сводится к получению предложения о зачислении. Программа сопровождает переход к университетской учёбе, помогает спланировать расходы и создать основу для самостоятельной академической работы.',
      ],
    },
    areas: {
      eyebrow: 'Состав программы',
      title: 'От образовательной цели к зачислению.',
      text: 'Четыре направления поддержки, объединённые персональным учебным планом. Объём помощи определяется задачами участника и выбранной образовательной траекторией.',
      tag: 'Raskur Scholars',
      items: [
        { title: 'Admission Track', text: 'Подбор университетов и программ, языковая подготовка, вступительные испытания, портфолио и практика интервью. Помогаем структурировать и редактировать собственные тексты абитуриента, сохраняя его авторство.' },
        { title: 'Study Grant', text: 'Грант до €20 000 на подготовительные расходы и первый год: экзамены, подачу документов, обучение, учебные материалы и первоначальное обустройство. Финансирование привязано к согласованному образовательному бюджету.' },
        { title: 'Academic Mentorship', text: 'Персональный наставник, регулярные встречи и разбор прогресса. От выбора направления и исследовательского проекта до планирования первого семестра.' },
        { title: 'Research Access', text: 'Вычисления и хранилища Raskur Cloud для портфолио, учебных проектов и первых исследований. Участник получает проектную среду и рекомендации по использованию ресурсов.' },
      ],
    },
    audience: {
      eyebrow: 'Критерии отбора',
      title: 'Для тех, кто готов к следующему шагу.',
      text: 'Программа ориентирована на первое высшее образование. Академический потенциал оценивается с учётом доступных человеку возможностей, а не только формальных результатов.',
      rows: [
        { term: 'Образовательный этап', text: 'Молодые люди 16-24 лет, которые завершают школу, учатся в колледже или готовятся к поступлению на бакалавриат после перерыва.' },
        { term: 'Академический интерес', text: 'Осмысленный выбор направления и готовность его развивать. Проекты, самостоятельная работа и устойчивый интерес дополняют оценки и результаты экзаменов.' },
        { term: 'Европейская траектория', text: 'Поступление в университеты Великобритании, Германии, Нидерландов, Франции, Швейцарии и других европейских стран. Язык и требования определяются выбранной программой.' },
        { term: 'Потребность в поддержке', text: 'При распределении грантов учитываются расходы на обучение, семейные обстоятельства и доступность других источников финансирования.' },
      ],
    },
    process: {
      eyebrow: 'Путь участника',
      title: 'Структурированный процесс. Индивидуальный маршрут.',
      text: 'От первичной оценки до первого семестра участника сопровождает координатор программы. Решение о зачислении всегда остаётся за университетом.',
      items: [
        { title: 'Академический профиль', text: 'Разбираем учебные интересы, проекты, подготовку и образовательный контекст. Определяем, где программа может принести наибольшую пользу.' },
        { title: 'Образовательный маршрут', text: 'Формируем список целевых программ, календарь экзаменов и подачи документов, план языковой подготовки и бюджет.' },
        { title: 'Решение о поддержке', text: 'Комиссия оценивает потенциал, мотивацию и финансовую потребность. Участник получает состав сопровождения и условия гранта.' },
        { title: 'Подготовка и поступление', text: 'Работаем над экзаменами, портфолио и интервью. Проверяем комплектность документов и соблюдение требований каждого университета.' },
        { title: 'Начало обучения', text: 'Помогаем спланировать переезд, расходы и учебную нагрузку. Наставничество продолжается в период адаптации к университету.' },
      ],
    },
    faq: {
      eyebrow: 'Вопросы и ответы',
      title: 'О программе Raskur Scholars',
      items: [
        { q: 'Какие направления обучения поддерживаются?', a: 'Программа охватывает технические, естественно-научные, социальные и гуманитарные направления. Выбор опирается на интересы абитуриента и требования конкретной университетской программы.' },
        { q: 'Как определяется размер Study Grant?', a: 'До €20 000 на участника в рамках согласованного бюджета. Учитываются стоимость подготовки и первого года, финансовая потребность и другие доступные источники поддержки.' },
        { q: 'Обязательно ли иметь идеальные оценки?', a: 'Нет. Оценки рассматриваются вместе с проектами, самостоятельной работой, образовательным контекстом и готовностью следовать плану подготовки.' },
        { q: 'Гарантирует ли программа поступление?', a: 'Raskur Scholars не гарантирует поступление. Университеты самостоятельно принимают решения. Упоминание европейских направлений не означает партнёрства или одобрения со стороны университетов.' },
        { q: 'Может ли наставник написать мотивационное письмо за участника?', a: 'Нет. Мы помогаем с планом, обратной связью и редактурой. Заявление, личная история и академические работы остаются работой самого абитуриента.' },
        { q: 'Что происходит после зачисления?', a: 'Координатор помогает спланировать начало учёбы, расходы и переезд. Наставничество продолжается в первом семестре, а Research Access поддерживает учебные и исследовательские проекты участника.' },
      ],
    },
  },
  en: {
    meta: {
      title: 'Raskur Scholars | access to leading European universities',
      description: 'Raskur Scholars brings together preparation for leading European universities, academic mentoring and grants of up to €20 000 towards preparation and the first year of study.',
      ogTitle: 'Raskur Scholars | education beyond boundaries',
      ogDescription: 'Access to leading European universities: Admission Track, Study Grant and academic mentoring with Raskur Scholars.',
    },
    announcement: { text: 'Raskur Scholars · Admissions preparation, study grants and academic mentoring' },
    hero: {
      eyebrow: 'Raskur Scholars / European University Programme',
      title: 'Your potential. Leading European universities.',
      lede: 'We help young people progress to leading European universities. From choosing a course and preparing for admissions assessments to funding the first year: one educational pathway, with a personal mentor at every stage.',
      primary: { label: 'Explore the programme', href: '#outline' },
      note: 'Undergraduate study · Individual preparation · Support based on academic potential and financial need',
    },
    facts: [
      { term: 'Destination', text: 'Europe' },
      { term: 'Participants', text: 'Ages 16-24' },
      { term: 'Study Grant', text: 'Up to €20 000' },
      { term: 'Support period', text: 'Up to 18 months' },
    ],
    purpose: {
      eyebrow: 'Our purpose',
      title: 'Opportunity should follow ability.',
      paragraphs: [
        'Admission to a demanding university takes more than strong subject knowledge. Understanding requirements, preparing for language assessments, finding time for applications and meeting the cost of starting all matter. Raskur Scholars brings that support into one programme.',
        'We work from each applicant’s academic interests, projects, educational context and budget. These shape a balanced university shortlist and a practical preparation timetable.',
        'Our purpose extends beyond receiving an offer. The programme supports the transition into university, helps participants plan their expenses and builds a foundation for independent academic work.',
      ],
    },
    areas: {
      eyebrow: 'Programme structure',
      title: 'From academic ambition to university entry.',
      text: 'Four areas of support, connected through a personal study plan. The package reflects each participant’s objectives and educational pathway.',
      tag: 'Raskur Scholars',
      items: [
        { title: 'Admission Track', text: 'University and course selection, language preparation, admissions assessments, portfolios and interview practice. We help applicants structure and edit their own statements while preserving their authorship.' },
        { title: 'Study Grant', text: 'Up to €20 000 towards preparation and the first year: assessment and application fees, tuition, study materials and initial settling-in costs. Funding follows an agreed educational budget.' },
        { title: 'Academic Mentorship', text: 'A personal mentor, regular meetings and progress reviews. Guidance covers subject choices, research projects and planning the first semester.' },
        { title: 'Research Access', text: 'Raskur Cloud compute and storage for portfolios, coursework and early research. Participants receive a project environment and guidance on using their resources.' },
      ],
    },
    audience: {
      eyebrow: 'Selection criteria',
      title: 'For people ready to take the next step.',
      text: 'The programme focuses on a first undergraduate degree. Academic potential is assessed in the context of the opportunities available to each person, not through results alone.',
      rows: [
        { term: 'Educational stage', text: 'Young people aged 16-24 completing school or college, or preparing for undergraduate entry after a gap in education.' },
        { term: 'Academic interest', text: 'A considered subject choice and the commitment to develop it. Projects, independent work and sustained curiosity complement grades and assessment results.' },
        { term: 'European pathway', text: 'Applications to universities in the United Kingdom, Germany, the Netherlands, France, Switzerland and other European countries. Language and entry requirements depend on the selected course.' },
        { term: 'Access needs', text: 'Grant decisions consider study costs, family circumstances and the availability of other funding.' },
      ],
    },
    process: {
      eyebrow: 'The participant journey',
      title: 'A structured process. An individual pathway.',
      text: 'A programme coordinator supports each participant from initial assessment to the first semester. Universities retain full responsibility for admissions decisions.',
      items: [
        { title: 'Academic profile', text: 'Review interests, projects, preparation and educational context. Identify where the programme can make the greatest difference.' },
        { title: 'Education plan', text: 'Build a course shortlist, assessment and application timetable, language preparation plan and budget.' },
        { title: 'Support decision', text: 'A panel assesses potential, motivation and financial need. Participants receive a defined support package and grant terms.' },
        { title: 'Preparation and admission', text: 'Work through assessments, portfolios and interviews. Check application completeness and each university’s requirements.' },
        { title: 'Starting university', text: 'Plan relocation, expenses and study commitments. Mentoring continues through the transition into university life.' },
      ],
    },
    faq: {
      eyebrow: 'Questions and answers',
      title: 'About Raskur Scholars',
      items: [
        { q: 'Which subjects does the programme cover?', a: 'Technical disciplines, natural sciences, social sciences and the humanities. Course selection follows the applicant’s interests and the requirements of the individual university programme.' },
        { q: 'How is the Study Grant calculated?', a: 'Up to €20 000 per participant within an agreed budget. Decisions take account of preparation and first-year costs, financial need and other available support.' },
        { q: 'Do applicants need perfect grades?', a: 'No. Results are considered alongside projects, independent work, educational context and the commitment to follow a preparation plan.' },
        { q: 'Does the programme guarantee a university place?', a: 'Raskur Scholars does not guarantee admission. Universities make their own decisions. References to European study destinations do not imply university partnerships or endorsements.' },
        { q: 'Will a mentor write a personal statement for a participant?', a: 'No. We support planning, feedback and editing. The application, personal account and academic work remain the applicant’s own.' },
        { q: 'What happens after admission?', a: 'A coordinator helps plan the start of university, expenses and relocation. Mentoring continues through the first semester, while Research Access supports coursework and research projects.' },
      ],
    },
  },
};
