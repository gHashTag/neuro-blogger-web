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

const neuroPhotoNeuroCoder = [
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/01.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/02.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/04.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/05.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/06.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/07.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/08.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/09.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/10.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/11.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/12.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/13.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/14.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/15.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/03.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/16.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/17.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/18.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/19.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/20.jpg',
  'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/portfolio/21.jpg',
]

export default function LandingPage() {
  return (
    <div>
      <SparklesPreview isHidden={false} />

      <ParallaxScrollDemo images={neuroPhotoNeuroCoder} />
      <StickyScrollRevealDemo />
      <CardStackDemo />
      <SparklesPreview isHidden={true} />
    </div>
  )
}
