import { useRouter } from 'next/router'
import TelegramCard from './TelegramCard'

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
  const router = useRouter()
  const { username, level } = router.query as {
    username: string
    level: string
  }
  const userLanguages = navigator.language
  const isRussian = userLanguages === 'ru-RU'

  const currentLevel = levels[Number(level)]

  if (!currentLevel) {
    return <p>{isRussian ? 'Уровень не найден' : 'Level not found'}</p>
  }
  const link = username === 'neuro_sage' ? links[username] : ''
  return (
    <TelegramCard
      level={Number(level)}
      imageSrc={`../../../../../../images/miniapp/${username}/${level}.jpg`}
      title={isRussian ? currentLevel.title_ru : currentLevel.title_en}
      is_ru={isRussian}
      link={link}
    />
  )
}
