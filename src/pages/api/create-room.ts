import type { NextApiRequest, NextApiResponse } from 'next'
import { RoomNode } from '@/interfaces'
import axios from 'axios'
import { isDev, ELESTIO_URL } from '@/config'

type ResponseData = {
  rooms?: RoomNode
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', ['POST'])
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { telegram_id, name, type, chat_id, token } = req.body

    const newData = {
      name,
      type,
      telegram_id,
      chat_id,
      token,
    }

    console.log(newData, 'handler: newData')

    const url = `${!isDev ? 'http://localhost:3000' : ELESTIO_URL}/room`
    console.log(url, 'handler: url')

    const response = await axios.post(url, newData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(response.data, 'handler: response.data')

    return res.status(200).json({ rooms: response.data })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message)
      return res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || 'Internal Server Error',
      })
    } else {
      console.error('Unexpected error:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
