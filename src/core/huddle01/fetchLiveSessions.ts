import axios from 'axios'
import { NEXT_PUBLIC_API_KEY } from '@/config'

export async function fetchLiveSessions() {
  try {
    const response = await axios.get(
      'https://api.huddle01.com/api/v2/sdk/live-sessions',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NEXT_PUBLIC_API_KEY,
        },
      }
    )
    console.log('✅ Успешно получен список активных сессий:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Ошибка при получении списка активных сессий:', error)
    throw error
  }
}
