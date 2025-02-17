import { initialAuthorState } from '@/data'
import { mockedUser } from '@/utils/constants'
import { isDev } from '@/config'
type UserType = {
  username: string
  telegram_id: string
  workspace_id: string
  workspace_name: string
  workspace_type: string | null
  header_name: string | null
  room_id: string | null
  room_name: string | null
  recording_id: string | null
  recording_name: string | null
  photo_url: string | null
  firstName: string | null
  lastName: string | null
  language_code: string | null
  is_owner: boolean | null
}

const useUser = (): UserType => {
  if (isDev) {
    console.log('Mocking user in development mode')
    localStorage.setItem('username', mockedUser.username)
    localStorage.setItem('telegram_id', mockedUser.telegram_id.toString())
    // localStorage.setItem('workspace_id', 'Fire')
  }

  const username = localStorage.getItem('username') || ''
  const telegram_id = localStorage.getItem('telegram_id') || ''
  const workspace_id = localStorage.getItem('workspace_id') || ''
  const workspace_name = localStorage.getItem('workspace_name') || ''
  const workspace_type = localStorage.getItem('workspace_type') || 'fire'

  const header_name = localStorage.getItem('header_name') || null
  const room_id = localStorage.getItem('room_id') || null
  const room_name = localStorage.getItem('room_name') || null
  const recording_id = localStorage.getItem('recording_id') || null
  const recording_name = localStorage.getItem('recording_name') || null
  const photo_url = localStorage.getItem('photo_url') || null
  const firstName = localStorage.getItem('first_name') || null
  const lastName = localStorage.getItem('last_name') || null
  const language_code = navigator.language.substring(0, 2) || null
  const owner = localStorage.getItem('is_owner') || null

  const is_owner = owner === 'false' ? false : true

  return {
    username,
    telegram_id,
    workspace_id,
    workspace_name,
    header_name,
    room_id,
    room_name,
    recording_id,
    recording_name,
    photo_url,
    firstName,
    lastName,
    language_code,
    is_owner,
    workspace_type,
  }
}

export { useUser }
