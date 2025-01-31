'use client'
import { ParallaxScroll } from '../ui/parallax-scroll'

export function ParallaxScrollDemo({ images }: { images: string[] }) {
  return <ParallaxScroll images={images} />
}
