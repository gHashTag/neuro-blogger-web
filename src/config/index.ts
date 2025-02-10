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

// Определите объект для хранения токенов и их соответствующих имен
const BOT_TOKENS_MAP: Record<string, string> = {
  NEXT_PUBLIC_BOT_TOKEN_1: 'neuro_sage',
  NEXT_PUBLIC_BOT_TOKEN_2: 'muse_nataly',
}

// Выберите токены в зависимости от окружения
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
  const tokenKey = Object.keys(BOT_TOKENS_MAP).find(
    key => process.env[key] === token
  )
  console.log(tokenKey, 'tokenKey')
  return tokenKey ? BOT_TOKENS_MAP[tokenKey] : 'neuro_sage'
}

// Экспортируйте токены по умолчанию
export const DEFAULT_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN_1
export const PULSE_BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN_1
