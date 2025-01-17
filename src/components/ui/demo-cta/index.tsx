import { useEffect, useRef } from 'react'
import useClickOutside from '@lib/hooks/use-click-outside'
import { useReactiveVar } from '@apollo/client'
import { visibleSignInVar, setInviterUserInfo } from '@/apollo/reactive-store'

import { TLoginButton, TLoginButtonSize, TUser } from 'react-telegram-auth'
// import createUser from '@/pages/api/create-user'
// import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from 'next/router'
import { __DEV__, botName, SITE_URL } from '@/utils/constants'

// export type CreateUserT = {
//   id: number
//   username: string
//   first_name: string
//   last_name: string
//   is_bot: boolean
//   language_code: string
//   chat_id: number
//   inviter: string
//   select_izbushka: string
//   telegram_id: number
//   photo_url: string
// }

// const createUser = async (user: TUser) => {
//   try {
//     const url = `${
//       __DEV__ ? 'http://localhost:3000' : process.env.ELESTIO_URL
//     }/user/create`
//     console.log(url, 'url')
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(user),
//     })

//     const result = await response.json()
//     console.log(result, 'result')
//     return result
//   } catch (error) {
//     console.error(error, 'error')
//     return { message: JSON.stringify(error) }
//   }
// }

// if (!process.env.NEXT_PUBLIC_ELESTIO_URL) {
//   throw new Error('NEXT_PUBLIC_ELESTIO_URL is not set')
// }

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL is not set')
}
if (!process.env.NEXT_PUBLIC_LOCAL_URL) {
  throw new Error('NEXT_PUBLIC_LOCAL_URL is not set')
}

export async function createUser(data: TUser) {
  try {
    console.log('CASE: CREATE USER 1')
    console.log(SITE_URL, 'SITE_URL')
    const response = await fetch(`${SITE_URL}/api/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error(error, 'error')
    return { error: error }
  }
}

const DemoButton = () => {
  const visible = useReactiveVar(visibleSignInVar)
  const userInfo = useReactiveVar(setInviterUserInfo)

  const router = useRouter()
  // const { createSupabaseUser } = useSupabase();

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('cta-btn')
      el?.classList.add('show-overlay')
      const tooltip = document.getElementById('cta-tooltip')
      tooltip?.classList.add('fade-in')
    }, 3000)
  }, [])
  const ctaRef = useRef(null)
  const clickedOutside = () => {
    const el = document.getElementById('cta-btn')
    const tooltip = document.getElementById('cta-tooltip')
    tooltip?.remove()
    el?.classList.remove('show-overlay')
  }
  useClickOutside(ctaRef, clickedOutside)

  const handleTelegramResponse = async (user: TUser) => {
    const userDataForBaseRecord = {
      ...user,
      ...userInfo,
      telegram_id: user.id,
    }
    console.log(user, 'user')
    console.log(userDataForBaseRecord, 'userDataForBaseRecord')
    const newUserDataFromBase = await createUser(userDataForBaseRecord)
    console.log(newUserDataFromBase, 'newUserDataFromBase')

    if (!userDataForBaseRecord.username) throw new Error('Username is required')
    if (!newUserDataFromBase.user_id) throw new Error('User ID is required')
    localStorage.setItem('username', userDataForBaseRecord.username)
    localStorage.setItem('user_id', newUserDataFromBase.user_id)

    localStorage.setItem('first_name', user.first_name)
    localStorage.setItem('last_name', user.last_name || '')
    localStorage.setItem('photo_url', user?.photo_url || '')

    localStorage.setItem('recording_id', '')
    localStorage.setItem('room_id', '')
    localStorage.setItem('workspace_id', '')
    localStorage.setItem('photo_url', '')
    router.push(`/${user.username}`)
  }

  return (
    <>
      {visible && (
        <TLoginButton
          botName={botName}
          buttonSize={TLoginButtonSize.Large}
          lang='en'
          usePic={true}
          cornerRadius={20}
          onAuthCallback={handleTelegramResponse}
          requestAccess={'write'}
          // additionalClasses={"css-class-for-wrapper"}
        />
      )}
    </>
  )
}

export default DemoButton
