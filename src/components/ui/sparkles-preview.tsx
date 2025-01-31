'use client'
import React from 'react'
import { SparklesCore } from '../ui/sparkles'
import { VortexDemo } from './vortex-demo'

export function SparklesPreview({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <div className='flex h-[35rem] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-black'>
      {!isHidden ? (
        <>
          <h1 className='relative z-20 text-center text-4xl font-bold text-white sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl'>
            НейроФото
          </h1>
          <div className='relative h-10 w-[40rem]'>
            {/* Gradients */}
            <div className='absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm' />
            <div className='absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent' />
            <div className='absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm' />
            <div className='absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent' />

            {/* Core component */}
            <SparklesCore
              background='transparent'
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className='h-full w-full'
              particleColor='#FFFFFF'
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className='absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]'></div>
          </div>
        </>
      ) : null}

      <VortexDemo />
    </div>
  )
}
