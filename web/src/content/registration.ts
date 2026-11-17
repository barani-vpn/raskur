import type { Lang } from './site';

export type RegistrationKind = 'cloud' | 'edu';
type Field = {
  name: string;
  label: Record<Lang, string>;
  type?: 'text' | 'email' | 'url';
  maxLength?: number;
  autocomplete?: string;
  optional?: boolean;
  options?: [string, string, string][];
};

export const contactFields: Field[] = [
  { name: 'name', label: { ru: 'Имя', en: 'Name' }, maxLength: 120, autocomplete: 'name' },
  { name: 'email', label: { ru: 'Электронная почта', en: 'Email address' }, type: 'email', maxLength: 254, autocomplete: 'email' },
];

export const requestFields: Record<RegistrationKind, Field[]> = {
  cloud: [
    { name: 'company', label: { ru: 'Компания', en: 'Company' }, maxLength: 120, autocomplete: 'organization' },
    { name: 'company_url', label: { ru: 'Сайт компании', en: 'Company website' }, type: 'url', maxLength: 512, autocomplete: 'url', optional: true },
    { name: 'company_size', label: { ru: 'Размер компании', en: 'Company size' }, options: [
      ['1-10', '1-10 сотрудников', '1-10 employees'], ['11-50', '11-50 сотрудников', '11-50 employees'],
      ['51-200', '51-200 сотрудников', '51-200 employees'], ['201-500', '201-500 сотрудников', '201-500 employees'],
      ['501-1000', '501-1 000 сотрудников', '501-1,000 employees'], ['1001-plus', 'Более 1 000 сотрудников', 'More than 1,000 employees'],
    ] },
    { name: 'industry', label: { ru: 'Отрасль', en: 'Industry' }, options: [
      ['software', 'Разработка ПО и ИТ', 'Software and IT'], ['financial-services', 'Финансовые услуги', 'Financial services'],
      ['retail', 'Торговля', 'Commerce and retail'], ['media', 'Медиа и игры', 'Media and gaming'],
      ['healthcare', 'Здравоохранение', 'Healthcare'], ['education-research', 'Образование и наука', 'Education and research'],
      ['manufacturing', 'Производство', 'Manufacturing'], ['professional-services', 'Профессиональные услуги', 'Professional services'],
      ['public-sector', 'Государственный сектор', 'Public sector'], ['other', 'Другое', 'Other'],
    ] },
    { name: 'country', label: { ru: 'Страна головного офиса', en: 'Headquarters country' }, maxLength: 80, autocomplete: 'country-name' },
    { name: 'role', label: { ru: 'Ваша роль', en: 'Your role' }, maxLength: 80, autocomplete: 'organization-title', optional: true },
    { name: 'service', label: { ru: 'Интересующие сервисы', en: 'Services of interest' }, options: [
      ['compute', 'Виртуальные машины', 'Virtual machines'], ['s3', 'Объектное хранилище S3', 'S3 object storage'],
      ['efs', 'Файловое хранилище', 'Shared file storage'], ['kubernetes', 'Kubernetes', 'Kubernetes'],
      ['postgresql', 'Managed PostgreSQL', 'Managed PostgreSQL'], ['clickhouse', 'Managed ClickHouse', 'Managed ClickHouse'],
      ['multiple', 'Несколько сервисов', 'Multiple services'],
    ] },
    { name: 'timeline', label: { ru: 'Когда нужны ресурсы', en: 'When you need resources' }, options: [
      ['now', 'Сейчас', 'Now'], ['quarter', 'В ближайшие три месяца', 'Within three months'], ['exploring', 'Изучаем варианты', 'Exploring options'],
    ] },
  ],
  edu: [
    { name: 'country', label: { ru: 'Страна проживания', en: 'Country of residence' }, maxLength: 80, autocomplete: 'country-name' },
    { name: 'age', label: { ru: 'Возрастная группа', en: 'Age group' }, options: [
      ['16-17', '16-17 лет', '16-17'], ['18-24', '18-24 года', '18-24'], ['25-plus', '25 лет и старше', '25 or older'],
    ] },
    { name: 'stage', label: { ru: 'Образовательный этап', en: 'Current education stage' }, options: [
      ['school', 'Школа', 'School'], ['college', 'Колледж', 'College'], ['gap-year', 'Перерыв перед поступлением', 'Gap year'], ['other', 'Другое', 'Other'],
    ] },
    { name: 'subject', label: { ru: 'Направление обучения', en: 'Subject area' }, options: [
      ['stem', 'Технологии и инженерия', 'Technology and engineering'], ['sciences', 'Естественные науки', 'Natural sciences'],
      ['social', 'Социальные науки', 'Social sciences'], ['arts', 'Искусство и гуманитарные науки', 'Arts and humanities'], ['undecided', 'Ещё выбираю', 'Still deciding'],
    ] },
    { name: 'support', label: { ru: 'Какая поддержка интересует', en: 'Support of interest' }, options: [
      ['admissions', 'Подготовка к поступлению', 'Admissions preparation'], ['funding', 'Финансирование обучения', 'Study funding'],
      ['mentoring', 'Академическое наставничество', 'Academic mentoring'], ['research', 'Ресурсы для исследований', 'Research resources'], ['combined', 'Несколько направлений', 'A combination'],
    ] },
    { name: 'timeline', label: { ru: 'Когда планируете поступать', en: 'When you plan to apply' }, options: [
      ['next-intake', 'Ближайший набор', 'Next intake'], ['later', 'Позже', 'A later intake'], ['exploring', 'Пока изучаю возможности', 'Exploring options'],
    ] },
  ],
};

export const registrationCopy = {
  ru: {
    cloud: {
      title: 'Заявка на подключение к Raskur Cloud', eyebrow: 'Raskur Cloud / Enterprise',
      description: 'Расскажите о компании и необходимой инфраструктуре. Эти данные помогут нам рассмотреть заявку на подключение и обсудить подходящую конфигурацию для вашей команды.',
      group: 'Компания и требования', note: '', submit: 'Подать заявку',
      message: 'Задачи и требования', hint: 'Например, тип нагрузки, объём данных или требования к размещению. Не указывайте пароли и другие секреты.',
      back: 'К облачной платформе',
    },
    edu: {
      title: 'Регистрация в Raskur Scholars', eyebrow: 'Raskur Scholars / Education',
      description: 'Расскажите о своих образовательных планах и интересующей поддержке. Мы сохраним запрос, чтобы оценить интерес к программе и связаться с вами по поводу участия.',
      group: 'Ваш образовательный маршрут', submit: 'Зарегистрировать запрос', note: 'Регистрация выражает интерес к программе. Она не означает получение гранта или зачисление в университет.',
      message: 'Образовательные планы', hint: 'Можно указать интересующие страны или направления. Не прикладывайте документы, медицинские сведения или финансовые данные. Форма предназначена для людей от 16 лет.',
      back: 'О программе',
    },
    contact: 'Контактные данные', required: 'Все поля обязательны, кроме отмеченных как необязательные.',
    optional: 'необязательно', choose: 'Выберите вариант',
    consent: 'Согласен на сохранение указанных данных проектом Додо Раскур для оценки спроса и связи со мной по этому запросу.',
    privacy: 'Как мы используем данные',
    privacyText: 'Данные формы хранятся на нашем сервере в Польше отдельно от публичного сайта и доступны команде для рассмотрения запросов. Для доставки и защиты трафика сайт использует Cloudflare. Мы не запрашиваем пароль, платёжные реквизиты или документы и не подписываем вас на рассылку. После отправки вы получите приватную ссылку: сохраните её, чтобы отозвать запрос и удалить сохранённые данные. Не передавайте эту ссылку другим людям.',
    receipt: 'Запрос сохранён', receiptText: 'Спасибо. Ваш запрос зарегистрирован для рассмотрения командой. Мы можем связаться с вами по указанной электронной почте, чтобы уточнить интерес и требования.',
    reference: 'Номер запроса', keepLink: 'Сохраните адрес этой страницы. Это ваша приватная ссылка для управления запросом.',
    withdraw: 'Отозвать запрос и удалить данные', withdrawTitle: 'Управление запросом',
    withdrawText: 'Если вы передумали, можно удалить сохранённый запрос. Для новой регистрации понадобится заполнить форму заново.',
    withdrawn: 'Запрос удалён', withdrawnText: 'Сохранённые данные этого запроса удалены. Вы можете вернуться к программе или зарегистрировать новый запрос.',
    registerAgain: 'К форме регистрации',
  },
  en: {
    cloud: {
      title: 'Request to join Raskur Cloud', eyebrow: 'Raskur Cloud / Enterprise',
      description: 'Tell us about your company and the infrastructure you need. These details help us review your request to join and discuss the right setup for your team.',
      group: 'Company and requirements', note: '', submit: 'Request to join',
      message: 'Workloads and requirements', hint: 'For example, workload type, data volumes or location requirements. Do not include passwords or other secrets.',
      back: 'Back to the cloud platform',
    },
    edu: {
      title: 'Register for Raskur Scholars', eyebrow: 'Raskur Scholars / Education',
      description: 'Tell us about your study plans and the support that interests you. We will save your request to understand demand for the programme and contact you about participation.',
      group: 'Your education plans', submit: 'Register request', note: 'Registration records your interest. It does not award a grant or secure a university place.',
      message: 'Study plans', hint: 'You can mention countries or subjects of interest. Do not include documents, medical information or financial details. This form is for people aged 16 or older.',
      back: 'About the programme',
    },
    contact: 'Contact details', required: 'All fields are required unless marked optional.',
    optional: 'optional', choose: 'Choose an option',
    consent: 'I agree to Dodo Raskur storing these details to assess demand and contact me about this request.',
    privacy: 'How we use your details',
    privacyText: 'Form responses are stored on our server in Poland, separately from the public site, for the team to review requests. Website traffic passes through Cloudflare for delivery and protection. We do not ask for passwords, payment details or documents, and this does not subscribe you to a mailing list. After submitting, you will receive a private link: keep it to withdraw your request and delete the saved details. Do not share this link with anyone else.',
    receipt: 'Request saved', receiptText: 'Thank you. Your request has been registered for the team to review. We may contact you at the email address you provided to understand your interest and requirements.',
    reference: 'Request reference', keepLink: 'Keep this page’s address. It is your private link for managing this request.',
    withdraw: 'Withdraw request and delete details', withdrawTitle: 'Manage your request',
    withdrawText: 'If you change your mind, you can delete the saved request. You will need to fill in the form again to register another request.',
    withdrawn: 'Request deleted', withdrawnText: 'The saved details for this request have been deleted. You can return to the programme or register a new request.',
    registerAgain: 'Back to registration',
  },
} as const;
