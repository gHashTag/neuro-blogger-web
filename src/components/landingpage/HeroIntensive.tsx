import { Star } from 'lucide-react'

interface HeroIntensiveProps {
  author: {
    name: string
    role: string
    experience: string
    bonusDescription: string
    imageUrl: string
  }
  title: string
  subtitle: string
  bonusTitle: string
  description: string
}

export function HeroIntensive({
  author,
  title,
  subtitle,
  description,
  bonusTitle,
}: HeroIntensiveProps) {
  return (
    <div className='relative mx-auto max-w-7xl px-4 pt-8'>
      {/* Фоновый градиент */}
      <div className='absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50 to-gray-100' />

      <div className='grid items-center gap-12 lg:grid-cols-2'>
        {/* Левая колонка */}
        <div className='space-y-10'>
          {/* Заголовок */}
          <div className='mb-10 text-center'>
            <h1 className='mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl'>
              <span className='block'>{title}</span>
            </h1>
            <h3 className='mb-4 text-lg font-semibold text-violet-700 sm:text-xl md:text-2xl'>
              {subtitle}
            </h3>
            <p className='mx-auto max-w-2xl text-base font-medium text-gray-600 sm:text-lg md:text-xl'>
              {description}
            </p>
          </div>

          {/* Бонус */}
          <div className='grid grid-cols-5 overflow-hidden rounded-xl bg-white shadow-lg'>
            <div className='col-span-1 flex items-center justify-center bg-violet-600 p-6'>
              <span className='rotate-12 transform text-5xl transition-transform hover:rotate-0 sm:text-7xl'>
                🎁
              </span>
            </div>
            <div className='col-span-4 p-6'>
              <div className='flex items-center gap-2 font-medium text-violet-600'>
                <Star className='h-5 w-5' />
                {bonusTitle}
              </div>
              <p className='mt-2 text-gray-800'>{author.bonusDescription}</p>
            </div>
          </div>
        </div>

        {/* Правая колонка - Изображение */}
        <div className='relative w-full'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={author.imageUrl}
            alt='AI Illustration'
            className='h-96 w-full rounded-xl object-cover shadow-lg lg:h-[500px]'
          />

          {/* Стеклянный стикер */}
          <div className='absolute bottom-4 left-4 rounded-xl border border-white/30 bg-white/10 p-3 backdrop-blur-lg'>
            <div className='space-y-0.5'>
              <p className='font-semibold text-white'>{author.name}</p>
              <p className='text-sm text-white/80'>{author.role}</p>
              <p className='text-sm font-medium text-violet-200'>
                {author.experience}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
