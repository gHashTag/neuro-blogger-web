'use client'
import React from 'react'
import { useRouter } from 'next/router'
import TelegramCard from '../../../../components/leelachakra/TelegramCard'
import { initData, retrieveLaunchParams } from '@telegram-apps/sdk'
import { useState, useEffect } from 'react'
import { isDev } from '@/config'
import { Atom } from 'react-loading-indicators'
import { getPlanNumber } from '@/core/supabase/getPlanNumber'
import { leelaLevels } from '../../../../components/leelachakra/leelaLevels'

export default function MiniApp() {
  const [userLanguageCode, setUserLanguageCode] = useState<string>('ru')
  const [userId, setUserId] = useState<string>('')
  const router = useRouter()
  const { username, level } = router.query as {
    username?: string
    level?: string
  }

  const [updateLevel, setUpdateLevel] = useState<number>(Number(level))

  useEffect(() => {
    if (!isDev) {
      const fetchData = async () => {
        try {
          const { initData } = retrieveLaunchParams()
          setUserLanguageCode(initData?.user?.languageCode || 'ru')

          const userId = initData?.user?.id?.toString()
          if (userId) {
            const planNumber = await getPlanNumber(userId)
            if (planNumber) {
              setUpdateLevel(planNumber.loka)
            } else {
              console.error('Не удалось получить номер плана')
            }
            setUserId(userId)
          } else {
            console.error('User ID is not available')
          }
        } catch (error) {
          console.error('Error retrieving launch parameters:', error)
        }
      }
      fetchData()
    }
  }, [])

  const currentLevel = leelaLevels[Number(level)]

  if (!currentLevel) {
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          backgroundColor: 'white',
        }}
      >
        <p>{currentLevel}</p>
        <Atom color='#000000' size='medium' text={currentLevel} />
      </div>
    )
  }

  const link = `https://t.me/neuro_blogger_bot?start=${userId}`

  const imageSrc = `https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/leelachakra/plans/${updateLevel}.jpg`

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
