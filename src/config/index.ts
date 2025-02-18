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

export const NEXT_PUBLIC_BOT_TOKEN_1 = process.env.NEXT_PUBLIC_BOT_TOKEN_1
export const NEXT_PUBLIC_BOT_TOKEN_2 = process.env.NEXT_PUBLIC_BOT_TOKEN_2
// Определите объект для хранения токенов и их соответствующих имен
const BOT_TOKENS_MAP = [
  {
    value: NEXT_PUBLIC_BOT_TOKEN_1,
    name: 'neuro_sage',
    botName: 'neuro_blogger_bot',
  },
  {
    value: NEXT_PUBLIC_BOT_TOKEN_2,
    name: 'muse_nataly',
    botName: 'MetaMuse_Manifest_bot',
  },
]

const BOT_TOKENS_PROD = [
  process.env.NEXT_PUBLIC_BOT_TOKEN_1,
  process.env.NEXT_PUBLIC_BOT_TOKEN_2,
]
const BOT_TOKENS_TEST = [
  process.env.NEXT_PUBLIC_BOT_TOKEN_TEST_1,
  process.env.NEXT_PUBLIC_BOT_TOKEN_TEST_2,
]

export const BOT_TOKENS = isDev ? BOT_TOKENS_TEST : BOT_TOKENS_PROD
// Функция для получения имени аватара по токену
export function getAvatarName(token: string): string {
  const tokenEntry = BOT_TOKENS_MAP.find(entry => {
    return entry.value === token
  })

  return tokenEntry ? tokenEntry.name : 'neuro_sage'
}

export const getBotNameByToken = (token: string): string | undefined => {
  const tokenEntry = BOT_TOKENS_MAP.find(entry => {
    return entry.value === token
  })

  return tokenEntry ? tokenEntry.botName : 'neuro_blogger_bot'
}
// Экспортируйте токены по умолчанию
export const DEFAULT_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN_1
export const PULSE_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN_1

if (!process.env.NEXT_PUBLIC_ELESTIO_URL)
  throw new Error('NEXT_PUBLIC_ELESTIO_URL is not defined')

export const ELESTIO_URL = process.env.NEXT_PUBLIC_ELESTIO_URL
