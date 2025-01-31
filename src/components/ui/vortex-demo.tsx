import React from 'react'
import { Vortex } from '../ui/vortex'
import { Button } from '@/components/ui/moving-border'

export function VortexDemo() {
  const onCreateOrder = () => {
    window.location.href = 'https://t.me/neuro_blogger_bot?start=144022504'
  }
  return (
    <div className='mx-auto h-[20rem] overflow-hidden rounded-md'>
      <Vortex
        backgroundColor='transparent'
        className='flex h-full w-full flex-col items-center justify-center px-0 py-4 sm:px-2 md:px-10'
      >
        <h2 className='text-center text-2xl font-bold text-white md:text-6xl'>
          {/* Заголовок */}
        </h2>
        <p className='mx-4 mt-2 max-w-xl text-center text-base text-white sm:mx-6 sm:text-lg md:mx-8 md:text-2xl lg:mx-10 lg:text-3xl'>
          Представь, как твои фотографии превращаются в стильные и современные
          произведения искусства, подчеркивая твою индивидуальность и выделяя из
          толпы.
        </p>
        <div className='mt-6 flex flex-col items-center gap-4 sm:flex-row'>
          <Button onClick={() => onCreateOrder()}>Заказать</Button>
          {/* <button className="px-4 py-2 text-white">Watch trailer</button> */}
        </div>
      </Vortex>
    </div>
  )
}
