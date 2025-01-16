'use client'
import { motion } from 'framer-motion'
import React from 'react'
import { ImagesSlider } from '../ui/images-slider'

export function ImagesSliderDemo() {
  const images = [
    'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/00.jpg',
    'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/01.jpg',
    'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/02.jpg',
    'https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/03.jpg',
  ]
  return (
    <ImagesSlider className='h-[40rem]' images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className='z-50 flex flex-col items-center justify-center'
      >
        <motion.p className='bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text py-4 text-center text-xl font-bold text-transparent md:text-6xl'>
          Создай свой цифровой образ с ИИ
          <br />
          Будь в тренде, выделяйся из толпы!
        </motion.p>
        <button className='relative mx-auto mt-4 rounded-full border border-emerald-500/20 bg-emerald-300/10 px-4 py-2 text-center text-white backdrop-blur-sm'>
          <span>Получить свой аватар →</span>
          <div className='absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-emerald-500 to-transparent' />
        </button>
      </motion.div>
    </ImagesSlider>
  )
}
