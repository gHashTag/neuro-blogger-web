'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[]
  className?: string
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ['start start', 'end start'],
  })

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200])
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200])
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200])
  const translateFourth = useTransform(scrollYProgress, [0, 1], [0, 200])
  const translateFifth = useTransform(scrollYProgress, [0, 1], [0, -200])
  const translateSixth = useTransform(scrollYProgress, [0, 1], [0, 200])

  const sixth = Math.ceil(images.length / 6) // Разделение на шесть частей

  const parts = Array.from({ length: 6 }, (_, i) =>
    images.slice(i * sixth, (i + 1) * sixth)
  )

  const ImageGrid = ({
    images,
    translate,
    gridKey,
  }: {
    images: string[]
    translate: any
    gridKey: string
  }) => (
    <div className='grid gap-10'>
      {images.map((el, idx) => (
        <motion.div style={{ y: translate }} key={`${gridKey}-${idx}`}>
          <Image
            src={el}
            className='!m-0 h-[calc(100vw*9/16)] w-full object-cover object-center !p-0'
            layout='responsive'
            width={16}
            height={9}
            alt='thumbnail'
          />
        </motion.div>
      ))}
    </div>
  )

  return (
    <div
      className={cn('h-[50rem] w-full items-start overflow-y-auto', className)}
      ref={gridRef}
    >
      <div className='mx-auto grid w-full max-w-none grid-cols-1 items-start gap-10 px-10 py-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {parts.map((part, index) => (
          <ImageGrid
            key={index}
            images={part}
            translate={
              index % 6 === 0
                ? translateFirst
                : index % 6 === 1
                  ? translateSecond
                  : index % 6 === 2
                    ? translateThird
                    : index % 6 === 3
                      ? translateFourth
                      : index % 6 === 4
                        ? translateFifth
                        : translateSixth
            }
            gridKey={`grid-${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
