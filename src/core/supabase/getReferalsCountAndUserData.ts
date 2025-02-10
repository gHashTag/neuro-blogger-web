import { Subscription, UserType } from '@/interfaces/supabase.interface'
import { supabase } from '.'
import { getAvatarName } from '@/config'

export const getReferalsCountAndUserData = async (
  telegram_id: string
): Promise<{
  count: number
  subscription: Subscription
  userData: UserType | null
  isExist: boolean
  avatar: string
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
        avatar: '',
      }
    }

    const avatar = getAvatarName(userData.token)

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
        avatar,
      }
    }

    return {
      count: data?.length || 0,
      subscription: userData.subscription || 'stars',
      userData: userData as UserType,
      isExist: true,
      avatar,
    }
  } catch (error) {
    console.error('Ошибка в getReferalsCountAndUserData:', error)
    return {
      count: 0,
      subscription: 'stars',
      userData: null,
      isExist: false,
      avatar: '',
    }
  }
}
