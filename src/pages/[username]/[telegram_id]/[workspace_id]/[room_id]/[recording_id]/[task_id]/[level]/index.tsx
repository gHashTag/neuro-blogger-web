import { useRouter } from 'next/router'
import TelegramCard from '@/components/neuroblogger/TelegramCard'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { useState, useEffect } from 'react'
import { isDev } from '@/config'
import { Atom } from 'react-loading-indicators'
import { getReferalsCountAndUserData } from '@/core/supabase'

interface Level {
  title_ru: string
  title_en: string
}

const levels: Record<number, Level> = {
  1: {
    title_ru: 'МОЗГ АВАТАРА',
    title_en: 'AVATAR BRAIN',
  },
  2: {
    title_ru: 'ЧАТ С АВАТАРОМ',
    title_en: 'CHAT WITH AVATAR',
  },
  3: {
    title_ru: 'ВЫБОР МОДЕЛИ ИИ',
    title_en: 'CHOOSE AI MODEL',
  },
  4: {
    title_ru: 'ЦИФРОВОЕ ТЕЛО',
    title_en: 'DIGITAL BODY',
  },
  5: {
    title_ru: 'НЕЙРОФОТО',
    title_en: 'NEUROPHOTO',
  },
  6: {
    title_ru: 'ПРОМПТ ИЗ ФОТО',
    title_en: 'PROMPT FROM PHOTO',
  },
  7: {
    title_ru: 'ГОЛОС АВАТАРА',
    title_en: 'AVATAR VOICE',
  },
  8: {
    title_ru: 'ТЕКСТ В ГОЛОС',
    title_en: 'TEXT TO VOICE',
  },
  9: {
    title_ru: 'ФОТО В ВИДЕО',
    title_en: 'PHOTO TO VIDEO',
  },
}

export default function MiniApp() {
  const [userLanguageCode, setUserLanguageCode] = useState<string>('ru')
  const [userId, setUserId] = useState<string>('')

  const [updateLevel, setUpdateLevel] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    if (!isDev) {
      const fetchData = async () => {
        try {
          const { initData } = retrieveLaunchParams()

          setUserLanguageCode(initData?.user?.languageCode || 'ru')

          const userId = initData?.user?.id?.toString()

          if (userId) {
            const { count } = await getReferalsCountAndUserData(userId)

            if (count) {
              setUpdateLevel(count)
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

  const currentLevel =
    updateLevel > 9
      ? { title_ru: 'ВСЕ УРОВНИ ПРОЙДЕНЫ', title_en: 'ALL LEVELS COMPLETED' }
      : levels[Number(updateLevel)]

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
        <Atom color='#000000' size='medium' text='' />
        <p>JSON.stringify(currentLevel)</p>
        <p>JSON.stringify(updateLevel)</p>
        <p>JSON.stringify(userLanguageCode)</p>
        <p>JSON.stringify(userId)</p>
      </div>
    )
  }

  const link = `https://t.me/neuro_blogger_bot?start=${userId}`

  const imageSrc = `../../../../../../images/miniapp/neuro_sage/${updateLevel}.jpg`

  let videoSrc = ''

  if (userLanguageCode === 'ru') {
    videoSrc = `../../../../../../images/miniapp/neuro_sage/video_ru/${updateLevel}.mp4`
  } else {
    videoSrc = `../../../../../../images/miniapp/neuro_sage/video_en/${updateLevel}.mp4`
  }

  return (
    <TelegramCard
      level={Number(updateLevel)}
      videoSrc={videoSrc}
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
