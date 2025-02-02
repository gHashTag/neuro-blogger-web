import { useEffect } from 'react'
import { ParallaxScrollDemo } from '@/components/ui/parallax-scroll-demo'

import { StickyScrollRevealDemo } from '@/components/ui/sticky-scroll-reveal-demo'
import { SparklesPreview } from '@/components/ui/sparkles-preview'
import { CardStackDemo } from '@/components/ui/card-stack-demo'
import { ContactSectionDark } from '@/components/landingpage/ContactSectionDark'
import { neuroPhotoNeuroCoder } from './photos'

export default function LandingPage() {
  return (
    <div>
      <SparklesPreview isHidden={false} />
      <ParallaxScrollDemo images={neuroPhotoNeuroCoder} />

      <StickyScrollRevealDemo />

      <section id='contacts' className='mt-10 px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CardStackDemo />
        </div>
      </section>
      <section id='contacts' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <ContactSectionDark
            title='Готовы вывести свой блог на новый уровень?'
            description='Оставьте заявку прямо сейчас и станьте одним из первых, кто воспользуется уникальным решением!'
            contact='https://t.me/neuro_sage'
          />
        </div>
      </section>
      <div className='h-[10rem] w-full'></div>
    </div>
  )
}
