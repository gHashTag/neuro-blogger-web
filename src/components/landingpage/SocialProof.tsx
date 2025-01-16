import React from 'react'
import { Star, TrendingUp, Users } from 'lucide-react'

export function SocialProof() {
  return (
    <div className='rounded-2xl bg-white/80 p-6 backdrop-blur-lg'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='flex items-center gap-4'>
          <div className='flex -space-x-4'>
            <img
              src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
              alt='User'
              className='h-12 w-12 rounded-full border-2 border-white'
            />
            <img
              src='https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop'
              alt='User'
              className='h-12 w-12 rounded-full border-2 border-white'
            />
            <img
              src='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop'
              alt='User'
              className='h-12 w-12 rounded-full border-2 border-white'
            />
          </div>
          <div>
            <div className='font-semibold'>3,450+</div>
            <div className='text-sm text-gray-600'>подписчиков</div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='rounded-lg bg-yellow-100 p-2'>
            <Star className='h-8 w-8 text-yellow-500' />
          </div>
          <div>
            <div className='font-semibold'>4.9 из 5</div>
            <div className='text-sm text-gray-600'>средняя оценка курса</div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='rounded-lg bg-green-100 p-2'>
            <TrendingUp className='h-8 w-8 text-green-500' />
          </div>
          <div>
            <div className='font-semibold'>93%</div>
            <div className='text-sm text-gray-600'>успешных выпускников</div>
          </div>
        </div>
      </div>
    </div>
  )
}
