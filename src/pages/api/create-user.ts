'use server'
import type { NextApiRequest, NextApiResponse } from 'next'

import { isDev, NEXT_PUBLIC_AI_SERVER_URL } from '@/config'

const headers = {
  'Content-Type': 'application/json',
}

export type CreateUserT = {
  id: number
  username: string
  first_name: string
  last_name: string
  is_bot: boolean
  language_code: string
  chat_id: number
  inviter: string
  select_izbushka: string
  telegram_id: number
  photo_url: string
}

type ResponseData = {
  telegram_id?: string
  passport_id_owner?: string
  passport_id_user?: string
  workspace_id?: string
  rooms_id?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Check the request method
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...headers } })
  }

  try {
    console.log('CASE: API CREATE USER')
    // const url = `${process.env.NEXT_PUBLIC_AI_SERVER_URL}/user/create`
    const url = `${isDev ? 'http://localhost:3000' : NEXT_PUBLIC_AI_SERVER_URL}/user/create`
    console.log(url, 'url')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })
    console.log(response, 'response')

    const result = await response.json()

    return res.status(200).json(result)
  } catch (error) {
    console.error(error, 'error')
    return res.status(500).json({ message: JSON.stringify(error) })
  }
}
