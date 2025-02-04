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

export const levels: Record<number, Level> = {
  0: {
    title_ru: '💫 Оформить подписку',
    title_en: '💫 Subscribe',
  },
  // digitalAvatarBodyWizard
  1: {
    title_ru: '🤖 Цифровое тело',
    title_en: '🤖 Digital Body',
  },
  // neuroPhotoWizard
  2: {
    title_ru: '📸 Нейрофото',
    title_en: '📸 NeuroPhoto',
  },
  // imageToPromptWizard
  3: {
    title_ru: '🔍 Промпт из фото',
    title_en: '🔍 Prompt from Photo',
  },
  // avatarWizard
  4: {
    title_ru: '🧠 Мозг аватара',
    title_en: '🧠 Avatar Brain',
  },
  // chatWithAvatarWizard
  5: {
    title_ru: '💭 Чат с аватаром',
    title_en: '💭 Chat with avatar',
  },
  // selectModelWizard
  6: {
    title_ru: '🤖 Выбор модели ИИ',
    title_en: '🤖 Choose AI Model',
  },
  // voiceAvatarWizard
  7: {
    title_ru: '🎤 Голос аватара',
    title_en: '🎤 Avatar Voice',
  },
  // textToSpeechWizard
  8: {
    title_ru: '🎙️ Текст в голос',
    title_en: '🎙️ Text to Voice',
  },
  // imageToVideoWizard
  9: {
    title_ru: '🎥 Фото в видео',
    title_en: '🎥 Photo to Video',
  },
  // textToVideoWizard
  10: {
    title_ru: '🎥 Видео из текста',
    title_en: '🎥 Text to Video',
  },
  // textToImageWizard
  11: {
    title_ru: '🖼️ Текст в фото',
    title_en: '🖼️ Text to Image',
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
