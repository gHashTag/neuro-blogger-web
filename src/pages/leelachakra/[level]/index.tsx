'use client'
import React from 'react'
import { useRouter } from 'next/router'
import TelegramCard from '../../../components/leelachakra/TelegramCard'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { useState, useEffect } from 'react'
import { isDev } from '@/config'

import { leelaLevels } from '../../../components/leelachakra/leelaLevels'
import Loader from '@/components/loader'

export default function MiniApp() {
  const [userLanguageCode, setUserLanguageCode] = useState<string>('ru')
  const [userId, setUserId] = useState<string>('')
  const router = useRouter()
  const { username, level } = router.query as {
    username?: string
    level?: string
  }

  useEffect(() => {
    if (!isDev) {
      try {
        const { initData } = retrieveLaunchParams()
        setUserLanguageCode(initData?.user?.languageCode || 'ru')

        const userId = initData?.user?.id?.toString()
        if (userId) {
          setUserId(userId)
        } else {
          console.error('User ID is not available')
        }
      } catch (error) {
        console.error('Error retrieving launch parameters:', error)
      }
    }
  }, [])

  const currentLevel = leelaLevels[Number(level)]

  if (!currentLevel) {
    return <Loader />
  }

  const link = `https://t.me/leelachakra_bot?start=${userId}`

  const imageSrc = `https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/leelachakra/plans/${level}.jpg`

  // let videoSrc = ''

  // if (userLanguageCode === 'ru') {
  //   videoSrc = `../../../../../../images/miniapp/neuro_sage/video_ru/${level}.mp4`
  // } else {
  //   videoSrc = `../../../../../../images/miniapp/neuro_sage/video_en/${level}.mp4`
  // }

  return (
    <TelegramCard
      level={Number(level)}
      // videoSrc={videoSrc}
      title={
        userLanguageCode === 'ru'
          ? currentLevel.title_ru
          : currentLevel.title_en
      }
      is_ru={userLanguageCode === 'ru'}
      link={link}
      imageSrc={imageSrc}
    />
  )
}
