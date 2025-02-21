// pages/api/fetchRoomMetadata.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { NEXT_PUBLIC_HUDDLE01_API_KEY } from '@/config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query
  console.log('fetchRoomMetadata - roomId:', roomId)
  try {
    const response = await axios.get(
      `https://api.huddle01.com/api/v2/sdk/rooms/get-metadata/${roomId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NEXT_PUBLIC_HUDDLE01_API_KEY,
        },
      }
    )
    console.log('response', response.data)
    res.status(200).json(response.data)
  } catch (error) {
    console.error('❌ Ошибка при получении метаданных комнаты:', error)
    res.status(500).json({ error: 'Ошибка при получении метаданных комнаты' })
  }
}
