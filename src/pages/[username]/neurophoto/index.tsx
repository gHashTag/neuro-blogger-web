import { useEffect } from 'react'
import { TextHoverEffect } from '../../../components/ui/text-hover-effect'
import { BentoGridThirdDemo } from '../../../components/ui/bento-grid-third'
import Layout from '@/components/layout'
import Hero from '@/components/hero'
import { ImagesSliderDemo } from '@/components/ui/images-slider-demo'
import { ParallaxScrollDemo } from '@/components/ui/parallax-scroll-demo'
import { VortexDemo } from '@/components/ui/vortex-demo'

import { StickyScrollRevealDemo } from '@/components/ui/sticky-scroll-reveal-demo'
import { SparklesPreview } from '@/components/ui/sparkles-preview'
import { InfiniteMovingCardsDemo } from '@/components/ui/infinite-moving-cards-demo'
import { CardStackDemo } from '@/components/ui/card-stack-demo'
import { BackgroundBoxesDemo } from '@/components/ui/background-boxes-demo'
import { ContactSection } from '@/components/landingpage/ContactSection'
import { ContactSectionDark } from '@/components/landingpage/ContactSectionDark'

const neuroPhotoNeuroCoder = [
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder1.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder2.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder3.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder5.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder7.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder8.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder9.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder10.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder11.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder12.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder13.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder14.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder15.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder16.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder17.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder18.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder19.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder20.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder21.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder22.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder23.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder24.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder25.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder26.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder27.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder28.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder29.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder30.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder31.jpg',
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/neurophoto/a_photo_of_neuro_coder32.jpg',
]

export default function LandingPage() {
  return (
    <div>
      <SparklesPreview isHidden={false} />
      <ParallaxScrollDemo images={neuroPhotoNeuroCoder} />
      <StickyScrollRevealDemo />
      <CardStackDemo />
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
