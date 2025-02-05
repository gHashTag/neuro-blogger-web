import React from 'react'
import { Vortex } from '../ui/vortex'
import { Button } from '@/components/ui/moving-border'

export function VortexDemo({
  title,
  description,
  href,
}: {
  description: string
  title: string
  href: string
}) {
  const onCreateOrder = () => {
    window.location.href = href
  }
  return (
    <div className='h-[30rem] w-full overflow-hidden'>
      <Vortex
        backgroundColor='transparent'
        className='flex h-full w-full flex-col items-center justify-center'
      >
        <h2 className='mx-auto max-w-4xl px-4 text-center text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
          {title}
        </h2>
        <p className='mx-auto mt-2 max-w-3xl px-4 text-center text-base text-white sm:text-lg md:text-xl'>
          {description}
        </p>
        <div className='mt-6 flex flex-col items-center gap-4 sm:flex-row'>
          <Button onClick={() => onCreateOrder()}>Заказать</Button>
          {/* <button className="px-4 py-2 text-white">Watch trailer</button> */}
        </div>
      </Vortex>
    </div>
  )
}
