import { useRouter } from 'next/router'
import TelegramCard from '../../../../../../../../components/neuroblogger/TelegramCard'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { useState, useEffect } from 'react'
import { isDev } from '@/config'
import { Atom } from 'react-loading-indicators'

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

  // const [message, setMessage] = useState<string | null>(null)
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
        if (initData?.user?.id) {
          setUserId(initData.user.id.toString())
        }
      } catch (error) {
        console.error('Error retrieving launch parameters:', error)
      }
    }
  }, [userLanguageCode])

  const currentLevel = levels[Number(level)]

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
      </div>
    )
  }

  const link = `https://t.me/neuro_blogger_bot?start=${userId}`

  const imageSrc = `../../../../../../images/miniapp/neuro_sage/${level}.jpg`

  let videoSrc = ''

  if (userLanguageCode === 'ru') {
    videoSrc = `../../../../../../images/miniapp/neuro_sage/video_ru/${level}.mp4`
  } else {
    videoSrc = `../../../../../../images/miniapp/neuro_sage/video_en/${level}.mp4`
  }

  return (
    <TelegramCard
      level={Number(level)}
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
