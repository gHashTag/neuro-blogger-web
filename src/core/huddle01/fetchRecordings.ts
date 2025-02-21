import axios from 'axios'
import { NEXT_PUBLIC_HUDDLE01_API_KEY } from '@/config'

export async function fetchRecordings(sessionId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.huddle01.com/api/v2/sdk/recordings?sessionId=${sessionId}&limit=1&cursor=1`,
    headers: {
      'x-api-key': NEXT_PUBLIC_HUDDLE01_API_KEY,
    },
  }

  try {
    const response = await axios.request(config)
    console.log('✅ Успешно получены записи сессии:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Ошибка при получении записей сессии:', error)
    throw error
  }
}
