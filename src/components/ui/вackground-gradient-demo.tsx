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
          src={`https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/neuro_coder/landing/hzbbu9s1p0zshylj9ur0.jpg`}
          alt='jordans'
          height='400'
          width='400'
          className='object-contain'
        />
        <p className='mb-2 mt-4 text-base text-black dark:text-neutral-200 sm:text-xl'>
          Пакет "Инфлюенсер"
        </p>

        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          - Настройка ИИ под твой стиль
          <br />
          - 10 уникальных аватаров в высоком качестве
          <br />
          - Доступ к телеграм-боту для создания 1000 вариаций
          <br />
        </p>
        <button className='mt-4 flex items-center space-x-1 rounded-full bg-black py-1 pl-4 pr-1 text-xs font-bold text-white dark:bg-zinc-800'>
          <span>Купить </span>
          <span className='rounded-full bg-zinc-700 px-2 py-0 text-[0.6rem] text-white'>
            10 000 ₽
          </span>
        </button>
      </BackgroundGradient>
    </div>
  )
}
