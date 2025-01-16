import { SITE_URL } from '@/utils/constants'

export async function createUser(data: unknown) {
  try {
    const url = `${SITE_URL}/api/create-user`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    console.log(response, 'response')

    const result = await response.json()
    return result
  } catch (error) {
    console.error(error, 'error')
    return { error: error }
  }
}
