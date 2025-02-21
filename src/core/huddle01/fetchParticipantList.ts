import axios from 'axios'
import { NEXT_PUBLIC_HUDDLE01_API_KEY } from '@/config'

export async function fetchParticipantList(sessionId: string) {
  try {
    const response = await axios.get(
      `https://api.huddle01.com/api/v2/sdk/rooms/participant-list?sessionId=${sessionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NEXT_PUBLIC_HUDDLE01_API_KEY,
        },
      }
    )
    console.log('✅ Успешно получен список участников:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Ошибка при получении списка участников:', error)
    throw error
  }
}
