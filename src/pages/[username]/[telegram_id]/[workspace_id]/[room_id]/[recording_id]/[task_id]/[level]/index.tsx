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

  const questCount = 11

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
            }
            setUserId(userId)
          }
        } catch (error) {
          console.error('Error retrieving launch parameters:', error)
        }
      }
      fetchData()
    }
  }, [])

  const currentLevel =
    updateLevel > questCount
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
      </div>
    )
  }

  const link = `https://t.me/neuro_blogger_bot?start=${userId}`

  const imageSrc =
    updateLevel > questCount
      ? 'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/miniapp/all_levels_completed.jpg'
      : `https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/miniapp/${updateLevel}.jpg`
  console.log(imageSrc, 'imageSrc')
  // let videoSrc = ''
  // console.log(videoSrc, 'videoSrc')

  // if (userLanguageCode === 'ru') {
  //   videoSrc =
  //     updateLevel > questCount
  //       ? 'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/miniapp/all_levels_completed.mp4'
  //       : `/images/miniapp/neuro_sage/video_ru/${updateLevel}.mp4`
  // } else {
  //   videoSrc =
  //     updateLevel > questCount
  //       ? 'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/miniapp/all_levels_completed.mp4'
  //       : `/images/miniapp/neuro_sage/video_en/${updateLevel}.mp4`
  // }

  return (
    <div>
      <TelegramCard
        allLevelsCompleted={updateLevel > questCount}
        level={Number(updateLevel)}
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
    </div>
  )
}
