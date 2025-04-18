import { Subscription, UserType } from '@/interfaces/supabase.interface'
import { supabase } from '.'

export const getReferalsCountAndUserData = async (
  telegram_id: string
): Promise<{
  count: number
  subscription: Subscription
  userData: UserType | null
  isExist: boolean
  botName: string
}> => {
  try {
    // Сначала получаем UUID пользователя
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id.toString())
      .single()

    if (userError || !userData) {
      console.error('Ошибка при получении user_id:', userError)
      return {
        count: 0,
        subscription: 'stars',
        userData: null,
        isExist: false,
        botName: '',
      }
    }

    // Теперь ищем рефералов по UUID
    const { data, error } = await supabase
      .from('users')
      .select('inviter')
      .eq('inviter', userData.user_id)

    if (error) {
      console.error('Ошибка при получении рефералов:', error)
      return {
        count: 0,
        subscription: 'stars',
        userData: null,
        isExist: false,
        botName: '',
      }
    }

    return {
      count: data?.length || 0,
      subscription: userData.subscription || 'stars',
      userData: userData as UserType,
      isExist: true,
      botName: userData.bot_name,
    }
  } catch (error) {
    console.error('Ошибка в getReferalsCountAndUserData:', error)
    return {
      count: 0,
      subscription: 'stars',
      userData: null,
      isExist: false,
      botName: '',
    }
  }
}
