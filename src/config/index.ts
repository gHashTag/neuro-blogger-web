import dotenv from 'dotenv'
dotenv.config()

export const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const NEXT_PUBLIC_MANAGEMENT_TOKEN =
  process.env.NEXT_PUBLIC_MANAGEMENT_TOKEN
export const NEXT_PUBLIC_AI_SERVER_URL = process.env.NEXT_PUBLIC_AI_SERVER_URL
export const NEXT_PUBLIC_LOCAL_URL = process.env.NEXT_PUBLIC_LOCAL_URL
export const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export const NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
export const SITE_URL = isDev
  ? process.env.NEXT_PUBLIC_LOCAL_URL
  : process.env.NEXT_PUBLIC_SITE_URL
export const botName = isDev ? 'ai_koshey_bot' : 'neuro_blogger_bot'
export const NEXT_PUBLIC_HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
export const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
export const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY
export const NEXT_PUBLIC_PRIVACY_POLICY_URL =
  process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL
export const NEXT_PUBLIC_COPYRIGHT_HOLDER =
  process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER
export const NEXT_PUBLIC_SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
export const NEXT_PUBLIC_100MS = process.env.NEXT_PUBLIC_100MS
export const NEXT_PUBLIC_AGENT_ID = process.env.NEXT_PUBLIC_AGENT_ID
export const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

export const NEXT_PUBLIC_BOT_TOKEN_TEST_1 =
  process.env.NEXT_PUBLIC_BOT_TOKEN_TEST_1
export const NEXT_PUBLIC_BOT_TOKEN_TEST_2 =
  process.env.NEXT_PUBLIC_BOT_TOKEN_TEST_2

// Переструктурированный объект BOT_DATA, содержащий информацию о ботах
export const BOT_DATA = {
  neuro_blogger_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_1,
    avatarName: 'neuro_sage',
    botName: 'neuro_blogger_bot',
    isProd: true,
  },
  MetaMuse_Manifest_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_2,
    avatarName: 'muse_nataly',
    botName: 'MetaMuse_Manifest_bot',
    isProd: true,
  },
  ZavaraBot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_3,
    avatarName: 'default',
    botName: 'ZavaraBot',
    isProd: true,
  },
  LeeSolarbot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_4,
    avatarName: 'default',
    botName: 'LeeSolarbot',
    isProd: true,
  },
  NeuroLenaAssistant_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_5,
    avatarName: 'lena_assistant',
    botName: 'NeuroLenaAssistant_bot',
    isProd: true,
  },
  NeurostylistShtogrina_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_6,
    avatarName: 'default',
    botName: 'NeurostylistShtogrina_bot',
    isProd: true,
  },
  Gaia_Kamskaia_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_7,
    avatarName: 'playom',
    botName: 'Gaia_Kamskaia_bot',
    isProd: true,
  },
  ai_koshey_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_TEST_1,
    avatarName: 'neuro_sage',
    botName: 'ai_koshey_bot',
    isProd: false,
  },
  clip_maker_neuro_bot: {
    token: process.env.NEXT_PUBLIC_BOT_TOKEN_TEST_2,
    avatarName: 'default',
    botName: 'clip_maker_neuro_bot',
    isProd: false,
  },
}

// Функция для создания обратного отображения от токенов к именам ботов
const createTokenToBotMap = () => {
  const result: Record<string, string> = {}
  Object.entries(BOT_DATA).forEach(([botName, data]) => {
    if (data.token) {
      result[data.token] = botName
    }
  })
  return result
}

// Объект для быстрого поиска имени бота по токену
const TOKEN_TO_BOT_MAP = createTokenToBotMap()

export const BOT_TOKENS = isDev
  ? Object.values(BOT_DATA)
      .filter(data => !data.isProd)
      .map(data => data.token)
      .filter(Boolean)
  : Object.values(BOT_DATA)
      .filter(data => data.isProd)
      .map(data => data.token)
      .filter(Boolean)

// Функция для получения имени аватара по токену
export function getAvatarName(token: string): string {
  const botName = TOKEN_TO_BOT_MAP[token]
  return botName && BOT_DATA[botName as keyof typeof BOT_DATA]
    ? BOT_DATA[botName as keyof typeof BOT_DATA].avatarName
    : 'neuro_sage'
}

export const getBotNameByToken = (token: string): string | undefined => {
  const botName = TOKEN_TO_BOT_MAP[token]
  return botName && BOT_DATA[botName as keyof typeof BOT_DATA]
    ? BOT_DATA[botName as keyof typeof BOT_DATA].botName
    : 'neuro_blogger_bot'
}

// Экспортируйте токены по умолчанию
export const DEFAULT_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN_1
export const PULSE_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN_1

export const ELESTIO_URL = process.env.NEXT_PUBLIC_ELESTIO_URL!

export const NEXT_PUBLIC_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!
export const NEXT_PUBLIC_HUDDLE01_API_KEY =
  process.env.NEXT_PUBLIC_HUDDLE01_API_KEY!

export const HUDDLE01_API_KEY = process.env.HUDDLE01_API_KEY!
