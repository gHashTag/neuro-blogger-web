import { useEffect, useState } from 'react'
import { neuroPhotoNeuroCoder, neuroPhotoPlayom } from '@/data/photos'
import { useRouter } from 'next/router'
import { StickyScrollRevealDemo } from '@/components/ui/sticky-scroll-reveal-demo'
import { SparklesPreview } from '@/components/ui/sparkles-preview'
import { ParallaxScrollDemo } from '@/components/ui/parallax-scroll-demo'
import Loader from '@/components/loader'
import { CardStackDemo } from '@/components/ui/card-stack-demo'
import { ContactSectionDark } from '@/components/landingpage/ContactSectionDark'

export default function LandingPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [autorImageUrl, setAutorImageUrl] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let neuroPhoto

    if (!router.isReady) return
    const newpathname = router.asPath

    const username = newpathname ? newpathname.split('/')[1] : null
    setUsername(username)
    switch (username) {
      case 'neuro_sage':
        neuroPhoto = neuroPhotoNeuroCoder
        setAutorImageUrl(
          'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/miniapp/01.jpg'
        )
        setUserId('144022504')
        break
      // case 'muse_nataly':
      //   neuroPhoto = metaMuseAutor
      //   break
      // case 'E_Zavarykin':
      //   neuroPhoto = ezavarykinAutor
      //   break
      case 'playom':
        neuroPhoto = neuroPhotoPlayom
        setAutorImageUrl(
          'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/playom/leelachakra.JPG'
        )
        setUserId('435572800')
        break
      default:
        neuroPhoto = neuroPhotoNeuroCoder
    }
    setPhotos(neuroPhoto)
  }, [router.asPath, router.isReady, photos])

  if (!router.isReady) return <Loader />

  return (
    <div>
      <SparklesPreview isHidden={false} />
      <ParallaxScrollDemo images={photos} />

      <StickyScrollRevealDemo />

      <section id='contacts' className='mt-10 px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CardStackDemo
            imageUrl={autorImageUrl || ''}
            refLink={`https://t.me/neuro_blogger_bot?start=${userId}`}
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
            contact={`https://t.me/${username}`}
          />
        </div>
      </section>
      <div className='h-[10rem] w-full'></div>
    </div>
  )
}
