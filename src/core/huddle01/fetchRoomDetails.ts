import axios from 'axios'
import { NEXT_PUBLIC_API_KEY } from '@/config'

export async function fetchRoomDetails(roomId: string) {
  try {
    const response = await axios.get(
      `https://api.huddle01.com/api/v2/sdk/rooms/room-details/${roomId}`,
      {
        headers: {
          'x-api-key': NEXT_PUBLIC_API_KEY,
        },
      }
    )
    console.log('✅ Успешно получены данные:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Ошибка при получении данных:', error)
    throw error
  }
}
