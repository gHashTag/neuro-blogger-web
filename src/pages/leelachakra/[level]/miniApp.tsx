import { useRouter } from 'next/router'
import TelegramCard from './TelegramCard'
import { initData, retrieveLaunchParams } from '@telegram-apps/sdk'
import { useState, useEffect } from 'react'
import { isDev } from '@/config'
import { Atom } from 'react-loading-indicators'
import { getPlanNumber } from '@/core/supabase/getPlanNumber'

interface Level {
  title_ru: string
  title_en: string
}

const levels: Record<number, Level> = {
  1: { title_ru: 'РОЖДЕНИЕ', title_en: 'BIRTH' },
  2: { title_ru: 'МАЙЯ', title_en: 'MAYA' },
  3: { title_ru: 'ГНЕВ', title_en: 'ANGER' },
  4: { title_ru: 'ЖАДНОСТЬ', title_en: 'LOBHHA' },
  5: {
    title_ru: 'ФИЗИЧЕСКИЙ ПЛАН (БХУ-ЛОКА)',
    title_en: 'PHYSICAL PLAN (BHU-LOKA)',
  },
  6: { title_ru: 'ЗАБЛУЖДЕНИЕ', title_en: 'DELUSION' },
  7: { title_ru: 'ТЩЕСЛАВИЕ', title_en: 'VANITY' },
  8: { title_ru: 'АЛЧНОСТЬ', title_en: 'GREED' },
  9: {
    title_ru: 'ЧУВСТВЕННЫЙ ПЛАН (КАМА-ЛОКА)',
    title_en: 'SENSORY PLAN (KAMA-LOKA)',
  },
  10: { title_ru: 'ОЧИЩЕНИЕ (ТАПА)', title_en: 'CLEANSING (TAPA)' },
  11: {
    title_ru: 'РАЗВЛЕЧЕНИЯ (ГАНДХАРВЫ)',
    title_en: 'ENTERTAINMENT (GANDHARVAS)',
  },
  12: { title_ru: 'ЗАВИСТЬ (ИРАСЬЯ)', title_en: 'ENVY (IRASYA)' },
  13: {
    title_ru: 'НЕЗНАЧИМОСТЬ (АНТАРИКША)',
    title_en: 'INSIGNIFICANCE (ANTARIKSHA)',
  },
  14: {
    title_ru: 'АСТРАЛЬНЫЙ ПЛАН (БХУВАР-ЛОКА)',
    title_en: 'ASTRAL PLAN (BHUVAR-LOKA)',
  },
  15: {
    title_ru: 'ФАНТАЗИЙНЫЙ ПЛАН (НАГА-ЛОКА)',
    title_en: 'FANTASY PLAN (NAGA-LOKA)',
  },
  16: { title_ru: 'РЕВНОСТЬ (ДВЕША)', title_en: 'JEALOUSY (DVECHA)' },
  17: { title_ru: 'СОСТРАДАНИЕ (ДАЙЯ)', title_en: 'COMPASSION (DAYA)' },
  18: {
    title_ru: 'ПЛАН РАДОСТИ (ХАРША-ЛОКА)',
    title_en: 'PLAN OF JOY (HARSHA-LOKA)',
  },
  19: {
    title_ru: 'ПЛАН КАРМЫ (КАРМА-ЛОКА)',
    title_en: 'PLAN OF ACTION (KARMA-LOKA)',
  },
  20: { title_ru: 'БЛАГОТВОРИТЕЛЬНОСТЬ (ДАНА)', title_en: 'CHARITY (DANA)' },
  21: {
    title_ru: 'ИСКУПЛЕНИЕ (САМАНА ПАПА)',
    title_en: 'REDEMPTION (SAMANA PAPA)',
  },
  22: {
    title_ru: 'ПЛАН ДХАРМЫ (ДХАРМА-ЛОКА)',
    title_en: 'PLAN OF DHARMA (DHARMA-LOKA)',
  },
  23: {
    title_ru: 'НЕБЕСНЫЙ ПЛАН (СВАРГА-ЛОКА)',
    title_en: 'HEAVENLY PLAN (SVARGA-LOKA)',
  },
  24: {
    title_ru: 'ПЛАН ТЩЕСЛАВИЯ (ТИШТА-ЛОКА)',
    title_en: 'PLAN OF VANITY (TISHTA-LOKA)',
  },
  25: {
    title_ru: 'ПЛАН ХОРОШЕЙ КОМПАНИИ (СУ-САН-ЛОКА)',
    title_en: 'PLAN OF GOOD COMPANY (SU-SANG-LOKA)',
  },
  26: {
    title_ru: 'ПЛАН ПЕЧАЛИ (ДУККХА)',
    title_en: 'PLAN OF SADNESS (DUKKHA)',
  },
  27: {
    title_ru: 'ПЛАН БЕСКОРЫСТНОГО СЛУЖЕНИЯ (ПАРАМАРТХА)',
    title_en: 'PLAN OF SELFLESS SERVICE (PARAMARTHA)',
  },
  28: {
    title_ru: 'ПЛАН ИСТИННОЙ РЕЛИГИОЗНОСТИ (СУДХАРМА)',
    title_en: 'PLAN OF TRUE RELIGION (SUDHARMA)',
  },
  29: {
    title_ru: 'ОТСУТСТВИЕ РЕЛИГИОЗНОСТИ (АДХАРМА)',
    title_en: 'PLAN OF ABSENCE OF RELIGION (ADHARMA)',
  },
  30: {
    title_ru: 'ПЛАН ХОРОШИХ ТЕНДЕНЦИЙ (УТТАМА ГАТИ)',
    title_en: 'PLAN OF GOOD TRENDS (UTTAMA GATI)',
  },
  31: {
    title_ru: 'ПЛАН СВЯТОСТИ (ЯКША-ЛОКА)',
    title_en: 'PLAN OF HOLINESS (YAKSHA-LOKA)',
  },
  32: {
    title_ru: 'ПЛАН БАЛАНСА (МАХАР ЛОКА)',
    title_en: 'PLAN OF BALANCE (MAHAR LOKA)',
  },
  33: {
    title_ru: 'ПЛАН АРОМАТОВ (ГАНДХА-ЛОКА)',
    title_en: 'PLAN OF AROMA (GANDHA-LOKA)',
  },
  34: {
    title_ru: 'ПЛАН ВКУСА (РАСА-ЛОКА)',
    title_en: 'PLAN OF TASTE (RASA-LOKA)',
  },
  35: {
    title_ru: 'ЧИСТИЛИЩЕ (НАРАКА-ЛОКА)',
    title_en: 'PURGATORY (NARAKA-LOKA)',
  },
  36: {
    title_ru: 'ЯСНОСТЬ УМА (СВАЧЧА)',
    title_en: 'CLARITY OF MIND (SWACCHA)',
  },
  37: {
    title_ru: 'ПЛАН ДЖНЯНЫ (ДЖНЯНА)',
    title_en: 'PLAN OF JNANA (JNANA)',
  },
  38: {
    title_ru: 'ПЛАН БЛАГОСОСТОЯНИЯ (САМАДХИ)',
    title_en: 'PLAN OF WELL-BEING (SAMADHI)',
  },
  39: {
    title_ru: 'ПЛАН АПАНА ЛОКА (АПАНА-ЛОКА)',
    title_en: 'PLAN OF APANA (APANA-LOKA)',
  },
  40: {
    title_ru: 'ВЬЯНА-ЛОКА',
    title_en: 'VYANA-LOKA',
  },
  41: {
    title_ru: 'ЧЕЛОВЕЧЕСКИЙ ПЛАН (ДЖАНА-ЛОКА)',
    title_en: 'HUMAN PLAN (JANA-LOKA)',
  },
  42: {
    title_ru: 'ПЛАН АГНИ (АГНИ-ЛОКА)',
    title_en: 'PLAN OF AGNI (AGNI-LOKA)',
  },
  43: {
    title_ru: 'РОЖДЕНИЕ ЧЕЛОВЕКА (МАНУШЬЯ-ДЖАНМА)',
    title_en: 'BIRTH OF MAN (MANUSHYA-DHAJMA)',
  },
  44: {
    title_ru: 'НЕВЕЖЕСТВО (АВИДЬЯ)',
    title_en: 'IGNORANCE (AVIDYA)',
  },
  45: {
    title_ru: 'ПРАВИЛЬНОЕ ЗНАНИЕ (СУВИДЬЯ)',
    title_en: 'PLAN OF CORRECT KNOWLEDGE (SUVIDYA)',
  },
  46: {
    title_ru: 'РАЗЛИЧЕНИЕ (ВИВЕКА)',
    title_en: 'DISCRIMINATION (VIVEKA)',
  },
  47: {
    title_ru: 'ПЛАН НЕЙТРАЛЬНОСТИ (САРАСВАТИ)',
    title_en: 'PLAN OF NEUTRALITY (SARASWATI)',
  },
  48: {
    title_ru: 'СОЛНЕЧНЫЙ ПЛАН (ЯМУНА)',
    title_en: 'SOLAR PLAN (YAMUNA)',
  },
  49: {
    title_ru: 'ЛУННЫЙ ПЛАН (ГАНГА)',
    title_en: 'LUNAR PLAN (GANGHA)',
  },
  50: {
    title_ru: 'ПЛАН АСКЕЗЫ (ТАПА-ЛОКА)',
    title_en: 'PLAN OF ASCETICISM (TAPA-LOKA)',
  },
  51: {
    title_ru: 'ЗЕМЛЯ (ПРИТХИВИ)',
    title_en: 'EARTH (PRITHIVI)',
  },
  52: {
    title_ru: 'ПЛАН НАСИЛИЯ (ХИМСА-ЛОКА)',
    title_en: 'PLAN OF VIOLENCE (HIMSA-LOKA)',
  },
  53: {
    title_ru: 'ПЛАН ЖИДКОСТИ (ДЖАЛА-ЛОКА)',
    title_en: 'PLAN OF FLUIDITY (DHAJA-LOKA)',
  },
  54: {
    title_ru: 'ПЛАН ДУХОВНОЙ ПРЕДАННОСТИ (БХАКТИ-ЛОКА)',
    title_en: 'PLAN OF SPIRITUAL DEVOTION (BHAGTI-LOKA)',
  },
  55: {
    title_ru: 'ЭГОИЗМ (АХАМКАРА)',
    title_en: 'SELFISHNESS (AHAMKARA)',
  },
  56: {
    title_ru: 'ПЛАН ИЗНАЧАЛЬНЫХ ВИБРАЦИЙ (ОМКАРА)',
    title_en: 'PLAN OF INITIAL VIBRATIONS (OMKARA)',
  },
  57: {
    title_ru: 'ПЛАН ГАЗОВ (ВАЙЮ ЛОКА)',
    title_en: 'PLAN OF GASES (VAIYU LOKA)',
  },
  58: {
    title_ru: 'ПЛАН СИЯНИЯ (ТЕДЖА ЛОКА)',
    title_en: 'PLAN OF RADIANCE (TEJA-LOKA)',
  },
  59: {
    title_ru: 'ПЛАН РЕАЛЬНОСТИ (САТЬЯ ЛОКА)',
    title_en: 'PLAN OF REALITY (SATYA-LOKA)',
  },
  60: {
    title_ru: 'ПОЗИТИВНЫЙ ИНТЕЛЛЕКТ (СУБУДДХИ)',
    title_en: 'POSITIVE INTELLIGENCE (SUBUDHYYA)',
  },
  61: {
    title_ru: 'НЕГАТИВНЫЙ ИНТЕЛЛЕКТ (ДУРБУДДХИ)',
    title_en: 'NEGATIVE INTELLIGENCE (DURBUDDHYA)',
  },
  62: {
    title_ru: 'СЧАСТЬЕ (СУКХА)',
    title_en: 'HAPPINESS (SUKSHA)',
  },
  63: {
    title_ru: 'ТАМАС (ТАМАС)',
    title_en: 'TAMAS (TAMAS)',
  },
  64: {
    title_ru: 'ФЕНОМЕНАЛЬНЫЙ ПЛАН (ПРАКРИТИ-ЛОКА)',
    title_en: 'PHENOMENAL PLAN (PRAKRITI-LOKA)',
  },
  65: {
    title_ru: 'ПЛАН ВНУТРЕННЕГО ПРОСТРАНСТВА (УРАНТА ЛОКА)',
    title_en: 'PLAN OF INNER SPACE (URANTA LOKA)',
  },
  66: {
    title_ru: 'ПЛАН БЛАЖЕНСТВА (АНАНДА ЛОКА)',
    title_en: 'PLAN OF BLISS (ANANDA LOKA)',
  },
  67: {
    title_ru: 'ПЛАН КОСМИЧЕСКОГО БЛАГА (РУДРА ЛОКА)',
    title_en: 'PLAN OF COSMIC GOOD (RUDRNA LOKA)',
  },
  68: {
    title_ru: 'ПЛАН КОСМИЧЕСКОГО СОЗНАНИЯ (ВАЙКУНТХА ЛОКА)',
    title_en: 'PLAN OF COSMIC CONSCIOUSNESS (VAIKUNTHA LOKA)',
  },
  69: {
    title_ru: 'ПЛАН АБСОЛЮТА (БРАХМА ЛОКА)',
    title_en: 'PLAN OF ABSOLUTE (BRAHMA LOKA)',
  },
  70: {
    title_ru: 'ПЛАН САТТВАГУНЫ (САТТВА ЛОКА)',
    title_en: 'PLAN OF SATTVAGUNA (SATTVA LOKA)',
  },
  71: {
    title_ru: 'ПЛАН РАДЖОГУНЫ (РАДЖОГУНА)',
    title_en: 'PLAN OF RAJAGUNA (RAJAGUNA)',
  },
  72: {
    title_ru: 'ПЛАН ТАМОГУНЫ (ТАМОГУНА)',
    title_en: 'PLAN OF TAMOGUNA (TAMOGUNA)',
  },
}

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
      try {
        const { initData } = retrieveLaunchParams()
        setUserLanguageCode(initData?.user?.languageCode || 'ru')

        const userId = initData?.user?.id?.toString()
        if (userId) {
          setUserId(userId)
        } else {
          console.error('User ID is not available')
        }

        if (level === '0') {
          const updateLevel = async () => {
            if (userId) {
              const planNumber = await getPlanNumber(userId)
              console.log('planNumber', planNumber)
              if (planNumber) {
                setUpdateLevel(planNumber.loka)
              } else {
                console.error('Не удалось получить номер плана')
              }
            } else {
              console.error('User ID is not available for updating level')
            }
          }
          updateLevel()
        } else {
          setUpdateLevel(Number(level))
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
