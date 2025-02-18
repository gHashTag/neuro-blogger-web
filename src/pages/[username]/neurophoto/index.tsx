import { useEffect, useState } from 'react'
import {
  neuroPhotoNeuroCoder,
  neuroPhotoPlayom,
  metaMuseAutor,
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
    const username = newpathname ? newpathname.split('/')[1] : null

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
        botName: 'MetaMuse_Manifest_bot',
        content: contentMuseNataly,
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
      },
    }

    const userConfig = config[username as keyof typeof config] || {
      photos: neuroPhotoNeuroCoder,
    }

    setState(prevState => ({
      ...prevState,
      username,
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
            price={4800}
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
