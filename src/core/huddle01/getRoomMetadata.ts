export async function getRoomMetadata(roomId: string) {
  try {
    const response = await fetch(
      `/api/huddle01/fetchRoomMetadata?roomId=${roomId}`
    )
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
