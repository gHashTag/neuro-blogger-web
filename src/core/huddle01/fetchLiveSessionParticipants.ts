import axios from 'axios'
import { NEXT_PUBLIC_API_KEY } from '@/config'

export async function fetchLiveSessionParticipants(roomId: string) {
  try {
    const response = await axios.get(
      `https://api.huddle01.com/api/v2/sdk/live-sessions/participants/${roomId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NEXT_PUBLIC_API_KEY,
        },
      }
    )
    console.log(
      '✅ Успешно получен список участников активной сессии:',
      response.data
    )
    return response.data
  } catch (error) {
    console.error(
      '❌ Ошибка при получении списка участников активной сессии:',
      error
    )
    throw error
  }
}
