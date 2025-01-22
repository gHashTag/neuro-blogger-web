import { useRouter } from 'next/router'
import TelegramCard from './TelegramCard'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { useState, useEffect } from 'react'
import { isDev } from '@/config'
import { getTranslation } from '@/supabase/getTranslation'

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

const links = {
  neuro_sage: 'https://t.me/neuro_blogger_bot?start=144022504',
}

export default function MiniApp() {
  const [userLanguageCode, setUserLanguageCode] = useState<string>('ru')
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
      } catch (error) {
        console.error('Error retrieving launch parameters:', error)
      }
    }
    // const getMessage = async () => {
    //   const message = await getTranslation(userLanguageCode, 'welcome_message')
    //   console.log('message', message)
    //   if (!message) {
    //     throw new Error('Message not found')
    //   }

    //   setMessage(message)
    // }
    // getMessage()
  }, [userLanguageCode])

  if (!username || !level) {
    return <p>Loading...</p>
  }

  const currentLevel = levels[Number(level)]

  if (!currentLevel) {
    return (
      <p>
        {userLanguageCode === 'ru' ? 'Уровень не найден' : 'Level not found'}
      </p>
    )
  }
  const link = username === 'neuro_sage' ? links[username] : ''
  const imageSrc = `../../../../../../images/miniapp/${username}/${level}.jpg`

  return (
    <TelegramCard
      level={Number(level)}
      imageSrc={imageSrc}
      title={
        userLanguageCode === 'ru'
          ? currentLevel.title_ru
          : currentLevel.title_en
      }
      is_ru={userLanguageCode === 'ru'}
      link={link}
    />
  )
}
