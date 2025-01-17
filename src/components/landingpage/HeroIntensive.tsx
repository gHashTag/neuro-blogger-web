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
          <div className='grid grid-cols-1 overflow-hidden rounded-xl bg-white shadow-lg sm:grid-cols-5'>
            <div className='flex items-center justify-center bg-violet-600 p-4 sm:col-span-1'>
              <span className='transform text-4xl transition-transform hover:rotate-0 sm:text-5xl md:text-6xl lg:text-7xl'>
                🎁
              </span>
            </div>
            <div className='p-4 sm:col-span-4'>
              <div className='mb-2 flex items-center gap-2 font-semibold text-violet-600'>
                <Star className='h-5 w-5' />
                <div className='flex flex-col'>
                  <span>СВОБОДА И МЕДИЙНОСТЬ</span>
                  <span>В ПОДАРОК ПРИ РЕГИСТРАЦИИ</span>
                </div>
              </div>
              <blockquote className='mt-2 border-l-4 border-gray-300 pl-4 italic text-gray-800'>
                <em>Живи, люби, твори - за тебя работает ИИ</em>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Правая колонка - Изображение */}
        <div className='relative w-full'>
          <img
            src={author.imageUrl}
            alt='AI Illustration'
            className='h-96 w-full rounded-xl object-cover shadow-lg lg:h-[500px]'
          />

          {/* Стеклянный стикер */}
          <div className='absolute inset-x-0 bottom-0 mb-4 flex justify-center'>
            <div className='rounded-xl border border-white/30 bg-white/10 p-3 backdrop-blur-lg'>
              <div className='space-y-0.5'>
                <p className='font-semibold text-white'>
                  Стань ИИ ИНФЛЮЕНСЕРОМ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
