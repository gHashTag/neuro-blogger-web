import { createClient } from '@supabase/supabase-js'
import {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
} from '../../config'

export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string
)

export * from './getPlan'

export * from './getPlanNumber'
export * from './getReferalsCountAndUserData'
