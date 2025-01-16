import React from 'react'
import { Instagram } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  image: string
  text: string
  stats: string
  instagramHandle: string
}

export function TestimonialCard({
  name,
  image,
  text,
  stats,
  instagramHandle,
}: TestimonialCardProps) {
  return (
    <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-pink-50/30 p-8 shadow-lg transition-all duration-500 hover:shadow-2xl'>
      <div className='absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 opacity-20 blur-3xl filter transition-transform duration-700 group-hover:translate-x-0 group-hover:translate-y-0'></div>

      <div className='relative mb-6 flex items-center gap-4'>
        <img
          src={image}
          alt={name}
          className='h-20 w-20 transform rounded-2xl object-cover ring-4 ring-pink-500/20 transition-all duration-300 group-hover:scale-105 group-hover:ring-pink-500/40'
        />
        <div>
          <h4 className='text-xl font-bold'>{name}</h4>
          <p className='text-lg font-medium text-pink-600'>{stats}</p>
          <div className='mt-2 flex items-center gap-2 rounded-full bg-white/50 px-3 py-1 text-sm text-gray-500 backdrop-blur-sm'>
            <Instagram className='h-4 w-4' />
            {instagramHandle}
          </div>
        </div>
      </div>

      <div className='relative'>
        <p className='leading-relaxed text-gray-600'>{text}</p>
        <div className='absolute -left-2 -top-2 font-serif text-8xl text-pink-500/10'>
          "
        </div>
      </div>
    </div>
  )
}
