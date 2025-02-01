import { useEffect, useRef } from 'react'
import useClickOutside from '@lib/hooks/use-click-outside'
import { useReactiveVar } from '@apollo/client'
import { visibleSignInVar, setInviterUserInfo } from '@/apollo/reactive-store'

import { TLoginButton, TLoginButtonSize, TUser } from 'react-telegram-auth'

import { useRouter } from 'next/router'
import { isDev, botName, SITE_URL } from '@/config'
import { mockedUser } from '@/utils/constants'

export async function createUser(data: TUser) {
  if (isDev) {
    console.log('Mocking createUser in development mode')
    return Promise.resolve(mockedUser)
  }
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
    if (isDev) {
      router.push(`/${mockedUser.username}/${mockedUser.telegram_id}`)
      return
    }
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

    if (isDev) {
      console.log('Using mocked data for development')
      localStorage.setItem('username', mockedUser.username)
      localStorage.setItem('telegram_id', mockedUser.id.toString())
    } else {
      if (!userDataForBaseRecord.username)
        throw new Error('Username is required')
      if (!newUserDataFromBase.telegram_id)
        throw new Error('User ID is required')
      localStorage.setItem('username', userDataForBaseRecord.username)
      localStorage.setItem('telegram_id', newUserDataFromBase.telegram_id)
    }

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
