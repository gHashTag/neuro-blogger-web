'use client'
import React from 'react'
import { BackgroundGradient } from '../ui/background-gradient'

import Image from 'next/image'

export function BackgroundGradientDemo({
  imageUrl,
  refLink,
  price,
  title,
}: {
  imageUrl: string
  refLink: string
  price: number
  title: string
}) {
  return (
    <div>
      <BackgroundGradient className='max-w-sm rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10'>
        <Image
          src={imageUrl}
          alt='jordans'
          height='400'
          width='400'
          className='object-contain'
        />
        <p className='mb-2 mt-4 text-lg text-black dark:text-neutral-200 sm:text-xl md:text-2xl'>
          {title}
        </p>

        <p className='text-base text-neutral-600 dark:text-neutral-400 sm:text-lg md:text-xl'>
          🛠️ Настройка ИИ под твой стиль
          <br />
          🎓 Обучение нейросети на ваших фото
          <br />
          🤖 Доступ к телеграм-боту
          <br />
          ✨ Эксклюзивные промпты и эффекты, доступные только в боте
          <br />
          🔄 Регулярные обновления
          <br />
          ⭐️ 476 звезд на баланс бота
          <br />
        </p>
        <button
          onClick={() => {
            window.open(refLink, '_blank')
          }}
          className='mt-4 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 from-cyan-500 to-blue-500 to-cyan-500 px-4 py-2 text-base font-bold text-white shadow-lg transition duration-300 ease-in-out hover:bg-gradient-to-l hover:shadow-xl'
        >
          <span>Купить</span>
          <span className='rounded-full bg-blue-700 px-3 py-1 text-sm text-white'>
            {price} ₽
          </span>
        </button>
      </BackgroundGradient>
    </div>
  )
}
