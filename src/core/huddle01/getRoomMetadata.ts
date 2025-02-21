import { SITE_URL } from '@/config'

export async function getRoomMetadata(roomId: string) {
  try {
    const url = `${SITE_URL}/api/huddle01/fetchRoomMetadata?roomId=${roomId}`
    console.log(url, 'getRoomMetadata: url')

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Ошибка при получении метаданных комнаты')
    }
    const data = await response.json()
    console.log('✅ Успешно получены метаданные комнаты:', data)
    return data
  } catch (error) {
    console.error('❌ Ошибка при получении метаданных комнаты:', error)
    throw error
  }
}
