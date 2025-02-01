export const isDev = process.env.NODE_ENV === 'development'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')

if (!process.env.NEXT_PUBLIC_AI_SERVER_URL)
  throw new Error('NEXT_PUBLIC_AI_SERVER_URL is not set')

if (!process.env.NEXT_PUBLIC_LOCAL_URL)
  throw new Error('NEXT_PUBLIC_LOCAL_URL is not set')

if (!process.env.NEXT_PUBLIC_SITE_URL)
  throw new Error('NEXT_PUBLIC_SITE_URL is not set')

export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const NEXT_PUBLIC_AI_SERVER_URL = process.env.NEXT_PUBLIC_AI_SERVER_URL

export const NEXT_PUBLIC_LOCAL_URL = process.env.NEXT_PUBLIC_LOCAL_URL

export const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export const SUPABASE_URL = process.env.SUPABASE_URL

export const NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

export const SITE_URL = isDev
  ? process.env.NEXT_PUBLIC_LOCAL_URL
  : process.env.NEXT_PUBLIC_SITE_URL

export const botName = isDev ? 'ai_koshey_bot' : 'neuro_blogger_bot'
