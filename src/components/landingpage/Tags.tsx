import { Instagram, TrendingUp } from 'lucide-react'
import { HeroIntensive } from './HeroIntensive'

export function Tags() {
  return (
    <section className='relative overflow-hidden px-4 pb-32 pt-20'>
      <div className='relative mx-auto max-w-7xl text-center'>
        {/* Теги */}
        <div className='mb-8 flex justify-center gap-4'>
          <span className='inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700'>
            <Instagram className='h-4 w-4' />
            Для блогеров
          </span>
          <span className='inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700'>
            <TrendingUp className='h-4 w-4' />
            Рост охватов в 3.5 раза
          </span>
        </div>
      </div>

      <section className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <HeroIntensive
            author={{
              name: 'John Doe',
              role: 'Developer',
              experience: '10 years',
              bonusDescription: 'Bonus description',
              imageUrl: 'https://via.placeholder.com/150',
            }}
          />
        </div>
      </section>
    </section>
  )
}
