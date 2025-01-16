import React from 'react'
import { Vortex } from '../ui/vortex'
import { Button } from '@/components/ui/moving-border'

export function VortexDemo() {
  const onCreateOrder = () => {
    window.location.href = 'https://t.me/NEUROBLOGGER'
  }
  return (
    <div className='mx-auto h-[20rem] w-[calc(100%-4rem)] overflow-hidden rounded-md'>
      <Vortex
        backgroundColor='transparent'
        className='flex h-full w-full flex-col items-center justify-center px-2 py-4 md:px-10'
      >
        <h2 className='text-center text-2xl font-bold text-white md:text-6xl'>
          {/* Заголовок */}
        </h2>
        <p className='mt-6 max-w-xl text-center text-sm text-white md:text-2xl'>
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
