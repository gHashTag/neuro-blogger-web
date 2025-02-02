import React from 'react'
import { Vortex } from '../ui/vortex'
import { Button } from '@/components/ui/moving-border'

export function VortexDemo() {
  const onCreateOrder = () => {
    window.location.href = 'https://t.me/neuro_blogger_bot?start=144022504'
  }
  return (
    <div className='h-[20rem] w-full overflow-hidden'>
      <Vortex
        backgroundColor='transparent'
        className='flex h-full w-full flex-col items-center justify-center'
      >
        <h2 className='text-center text-2xl font-bold text-white md:text-6xl'>
          {/* Заголовок */}
        </h2>
        <p className='mx-auto mt-2 w-1/2 text-center text-base text-white sm:text-lg md:text-2xl lg:text-3xl'>
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
