'use client'
import React from 'react'
import { BackgroundGradient } from '../ui/background-gradient'
import { IconAppWindow } from '@tabler/icons-react'
import Image from 'next/image'

export function BackgroundGradientDemo() {
  return (
    <div>
      <BackgroundGradient className='max-w-sm rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10'>
        <Image
          src={`https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars/neuro_sage/miniapp/01.jpg`}
          alt='jordans'
          height='400'
          width='400'
          className='object-contain'
        />
        <p className='mb-2 mt-4 text-base text-black dark:text-neutral-200 sm:text-xl'>
          Тариф "Нейрофото"
        </p>

        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          - Настройка ИИ под твой стиль
          <br />
          - Обучение нейросети на ваших фото
          <br />
          - Доступ к телеграм-боту для создания фото
          <br />
          - Эксклюзивные промпты и эффекты, доступные только в боте
          <br />
          - Регулярные обновления функционала с учетом пожеланий пользователей
          <br />
        </p>
        <button
          onClick={() => {
            window.open(
              'https://t.me/neuro_blogger_bot?start=144022504',
              '_blank'
            )
          }}
          className='mt-4 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 from-cyan-500 to-blue-500 to-cyan-500 px-4 py-2 text-base font-bold text-white shadow-lg transition duration-300 ease-in-out hover:bg-gradient-to-l hover:shadow-xl'
        >
          <span>Купить</span>
          <span className='rounded-full bg-blue-700 px-3 py-1 text-sm text-white'>
            5 000 ₽
          </span>
        </button>
      </BackgroundGradient>
    </div>
  )
}
