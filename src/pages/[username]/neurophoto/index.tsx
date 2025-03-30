import { useEffect, useState } from 'react'
import {
  neuroPhotoNeuroCoder,
  neuroPhotoPlayom,
  metaMuseAutor,
  neuroPhotoRyabinikaPerm,
} from '@/data/photos'
import { contentDefault, contentMuseNataly } from '@/data/stepscontent'
import { useRouter } from 'next/router'
import { StickyScrollRevealDemo } from '@/components/ui/sticky-scroll-reveal-demo'
import { SparklesPreview } from '@/components/ui/sparkles-preview'
import { ParallaxScrollDemo } from '@/components/ui/parallax-scroll-demo'
import Loader from '@/components/loader'
import { CardStackDemo } from '@/components/ui/card-stack-demo'
import { ContactSectionDark } from '@/components/landingpage/ContactSectionDark'

const url =
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars'

export default function LandingPage() {
  const [state, setState] = useState({
    photos: [] as string[],
    username: null as string | null,
    autorImageUrl: null as string | null,
    userId: null as string | null,
    title: null as string | null,
    subTitle: null as string | null,
    subDescription: null as string | null,
    botName: 'neuro_blogger_bot',
    content: contentDefault,
  })

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const newpathname = router.asPath
    console.log('🔍 Исходный путь:', newpathname)

    // Получаем username из пути, игнорируя /neurophoto
    const pathParts = newpathname.split('/')
    const rawUsername = pathParts.length > 1 ? pathParts[1] : null
    console.log('👤 Исходное имя пользователя:', rawUsername)

    // Приводим к нижнему регистру для сравнения
    const username = rawUsername?.toLowerCase()
    console.log('👤 Имя пользователя в нижнем регистре:', username)

    // Маппинг для разных вариантов написания имени пользователя
    const usernameMapping: { [key: string]: string } = {
      ryabinika_perm: 'ryabinika_perm',
      neuro_sage: 'neuro_sage',
      muse_nataly: 'muse_nataly',
      playom: 'playom',
    }

    // Получаем корректное имя пользователя из маппинга
    const normalizedUsername = usernameMapping[username ?? ''] || username
    console.log('🔧 Нормализованное имя:', normalizedUsername)

    const config = {
      neuro_sage: {
        photos: neuroPhotoNeuroCoder,
        autorImageUrl: `${url}/neuro_blogger_bot/miniapp/quest/0.jpg`,
        userId: '144022504',
        title: 'НейроФото',
        subTitle: 'Нейрофотосессия',
        subDescription:
          'Представь, как твои фотографии превращаются в стильные и современные произведения искусства, подчеркивая твою индивидуальность и выделяя из толпы.',
        content: contentDefault,
        botName: 'neuro_blogger_bot',
      },
      muse_nataly: {
        photos: metaMuseAutor,
        autorImageUrl: `${url}/MetaMuse_Manifest_bot/muse_nataly.jpeg`,
        userId: '144022504',
        title: 'АВАТАР ИЗ ВЫСШЕГО Я',
        subTitle:
          'Карта желаний и фотосессии для блога в телеграм боте за 2 сек. 24/7',
        subDescription:
          'Представь, как твои фотографии превращаются в стильные и современные произведения искусства, подчеркивая твою индивидуальность, манифестируя высшую версию себя.',
        content: contentMuseNataly,
        botName: 'MetaMuse_Manifest_bot',
      },
      playom: {
        photos: neuroPhotoPlayom,
        autorImageUrl: `${url}/playom/leelachakra.JPG`,
        userId: '435572800',
        title: 'НейроФото',
        subTitle: '',
        subDescription:
          'Представь, как твои фотографии превращаются в стильные и современные произведения искусства, подчеркивая твою индивидуальность и выделяя из толпы.',
        content: contentDefault,
        botName: 'Gaia_Kamskaia_bot',
      },
      ryabinika_perm: {
        photos: neuroPhotoRyabinikaPerm,
        autorImageUrl: `${url}/NeuroLenaAssistant_bot/NeuroLenaAssistant_bot_step2.JPG`,
        userId: '2086031075',
        title: 'НейроФото',
        subTitle: '',
        subDescription:
          'Представь, как твои фотографии превращаются в стильные и современные произведения искусства, подчеркивая твою индивидуальность и выделяя из толпы.',
        content: contentDefault,
        botName: 'NeuroLenaAssistant_bot',
      },
    }

    console.log('🔧 Проверяем конфигурацию для:', normalizedUsername)
    console.log('🔑 Доступные конфигурации:', Object.keys(config))

    const userConfig = config[normalizedUsername as keyof typeof config] || {
      photos: neuroPhotoNeuroCoder,
    }

    console.log('⚙️ Конфигурация загружена:', !!userConfig)
    console.log('📸 Количество фотографий:', userConfig.photos.length)
    console.log('🖼️ Первая фотография:', userConfig.photos[0])
    console.log('🤖 Имя бота:', userConfig.botName)

    setState(prevState => ({
      ...prevState,
      username: normalizedUsername || null,
      ...userConfig,
    }))
  }, [router.asPath, router.isReady])

  if (!router.isReady) return <Loader />

  const {
    photos,
    autorImageUrl,
    userId,
    title,
    subTitle,
    subDescription,
    botName,
    content,
  } = state

  return (
    <div>
      <SparklesPreview
        isHidden={false}
        title={title || ''}
        subTitle={subTitle || ''}
        subDescription={subDescription || ''}
        href={`https://t.me/${botName}?start=${userId}`}
      />
      <ParallaxScrollDemo images={photos} />

      <StickyScrollRevealDemo content={content} />

      <section id='contacts' className='mt-10 px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CardStackDemo
            imageUrl={autorImageUrl || ''}
            refLink={`https://t.me/${botName}?start=${userId}`}
            price={1110}
            title='Тариф "Нейрофото"'
          />
        </div>
      </section>
      <section id='contacts' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <ContactSectionDark
            title='Готовы вывести свой блог на новый уровень?'
            description='Оставьте заявку прямо сейчас и станьте одним из первых, кто воспользуется уникальным решением!'
            contact={`https://t.me/${state.username}`}
          />
        </div>
      </section>
      <div className='h-[10rem] w-full'></div>
    </div>
  )
}
