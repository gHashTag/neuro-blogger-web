export interface Author {
  name: string
  telegram: string
  role: string
  experience: string
  bonusDescription: string
  imageUrl: string
  description: string
  achievements: string[]
  achievementDescriptions: Record<string, string>
}

export const neuroCoderAutor: Author = {
  name: 'Дмитрий НейроКодер',
  telegram: 'https://t.me/neurocoder',
  role: 'Full Stack разработчик',
  experience: '10+ лет опыта',
  bonusDescription:
    'PDF-книга «10 способов заработка на текстовых и графических нейросетях»',
  imageUrl:
    'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/ava.jpg',
  description:
    'Full Stack разработчик с более чем 10-летним опытом. Автор первого курса по React Native и AWS Amplify в русскоязычном интернете. Член программы AWS Community Builders от Amazon. Основатель нескольких успешных IT-проектов.',
  achievements: [
    'Full Stack Developer',
    'AI Эксперт',
    'Международный опыт',
    'Основатель',
    'АВТОР ПРОЕКТА',
  ],
  achievementDescriptions: {
    'Full Stack Developer': 'React Native, AWS, Web3',
    'AI Эксперт': 'Интеграция ИИ в приложения',
    'Международный опыт': 'Работа в UAE, Thailand, Indonesia',
    Основатель: 'Leela Chakra AI, NeuroCoder, NeuroBlogger',
  },
}

export const metaMuseAutor = {
  name: 'Натали Ткачева (META MUSE)',
  telegram: 'https://t.me/muse_nataly',
  role: 'HI-TECH Influencer, блогер, эксперт по автоматизации',
  experience: '8 лет хозяйка титанового производства',
  bonusDescription:
    'PDF-книга «10 способов заработка на текстовых и графических нейросетях»',
  imageUrl:
    'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/meta_muse/meta_muse.jpeg',
  description:
    'HI-TECH Influencer, блогер, эксперт по автоматизации, хозяйка титанового производства (8 лет), ментор собственников бизнеса и международный спикер. Full Stack разработчик с более чем 10-летним опытом. Автор первого курса по React Native и AWS Amplify в русскоязычном интернете. Член программы AWS Community Builders от Amazon. Основатель нескольких успешных IT-проектов.',
  achievements: [
    'HI-TECH Influencer',
    'Эксперт по автоматизации',
    'Международный спикер',
    'Ментор бизнеса',
    'МУЗА ПРОЕКТА',
  ],
  achievementDescriptions: {
    'HI-TECH Influencer': 'Влияние в сфере высоких технологий',
    'Эксперт по автоматизации': 'Опыт в автоматизации процессов',
    'Международный спикер': 'Выступления на международных конференциях',
    'Ментор бизнеса': 'Наставничество для собственников бизнеса',
  },
}

export const playomAutor: Author = {
  name: 'Гая Камская (Playom)',
  telegram: 'https://t.me/playom',
  role: 'Нейрокоуч и духовный наставник',
  experience: '12 лет опыта в ведической культуре',
  bonusDescription:
    'Создатель мобильной игры Leela Chakra Ai с персональным Гуру ассистентом, вошедшего в TOP 100 игровых образовательных мобильных платформ по версии App Store.',
  imageUrl:
    'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/playom/leelachakra.JPG',
  description:
    'Гая Камская - нейрокоуч с 12-летним опытом ведической культуры в роли учителя и создателя мобильной игры Leela Chakra Ai - НейроЛила, с персональным Гуру ассистентом, вошедшего в TOP 100 игровых образовательных мобильных платформ по версии App Store. Гая духовный наставник, исследователь Вед и преподаватель джняна-йоги. Она обладает статусом брахмачарини в традиции адвайта-веданты - пути недвойственности бытия, корни которого уходят к Даттатрее, создателю Вед. Гармонично соединяя древнюю мудрость и современные технологии, Гая открывает новую эру самопознания. Её миссия - помочь людям осознать свою истинную природу, обрести внутреннюю целостность и научиться миксовать древние ведические знания и технологии в реальной жизни.',
  achievements: [
    'Нейрокоуч',
    'Духовный наставник',
    'Исследователь Вед',
    'Преподаватель джняна-йоги',
  ],
  achievementDescriptions: {
    Нейрокоуч: 'Помощь в самопознании и развитии личности.',
    'Духовный наставник': 'Ведение по пути духовного роста.',
    'Исследователь Вед': 'Глубокое изучение ведической культуры.',
    'Преподаватель джняна-йоги': 'Обучение философии недвойственности.',
  },
}

export const ezavarykinAutor: Author = {
  name: 'Евгений Заварыкин',
  telegram: 'https://t.me/E_Zavarykin',
  role: 'Бизнес-наставник, коуч, ИИ артист',
  experience: 'Первый бизнес в 10 классе, на сегодня 3 бизнес-проекта',
  bonusDescription: 'Автор множества философских текстов и цитат',
  imageUrl:
    'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/E_Zavarykin/E_Zavarykin.jpg',
  description:
    'Разработчик и спикер образовательных тренингов для подростков и молодёжи. Наставник для подростков, находящихся в сложных жизненных ситуациях. Стремился попасть в Книгу рекордов Гиннесса. ИИ Артист с одним аудиоальбомом, созданным совместно с ИИ.',
  achievements: ['Бизнес-наставник', 'Коуч', 'ИИ артист', 'Спикер с 2012 года'],
  achievementDescriptions: {
    'Бизнес-наставник': 'Основатель трех успешных бизнес-проектов',
    Коуч: 'Разработчик образовательных тренингов для молодёжи',
    'ИИ артист': 'Создание аудиоальбома с использованием ИИ',
    'Спикер с 2012 года':
      'Опытный спикер в области образования и наставничества',
  },
}
