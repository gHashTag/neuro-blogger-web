import React from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  image: string
  title: string
  description: string
}

export function FeatureCard({
  icon,
  image,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-pink-50/50 shadow-lg transition-all duration-500 hover:shadow-2xl'>
      <div className='relative aspect-video overflow-hidden'>
        <img
          src={image}
          alt={title}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>
        <div className='absolute bottom-4 left-4 right-4 translate-y-full transform transition-transform duration-500 group-hover:translate-y-0'>
          <div className='mb-2 inline-block rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-lg'>
            {icon}
          </div>
          <h3 className='text-2xl font-bold text-white'>{title}</h3>
        </div>
      </div>
      <div className='p-6'>
        <p className='text-gray-600 transition-colors duration-300 group-hover:text-gray-900'>
          {description}
        </p>
      </div>
    </div>
  )
}
