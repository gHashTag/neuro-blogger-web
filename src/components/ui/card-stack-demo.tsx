'use client'
import { CardStack } from '../ui/card-stack'
import { cn } from '@/lib/utils'
import { BackgroundGradientDemo } from './вackground-gradient-demo'
export function CardStackDemo() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
        Отзывы клиентов
      </h2>
      <div className='flex h-[30rem] w-full items-center justify-center'>
        <CardStack items={CARDS} />
      </div>
      <h2 className='my-20 mt-16 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
        Цена
      </h2>
      <div className='mt-16 flex h-[50rem] w-full items-center justify-center'>
        <BackgroundGradientDemo />
      </div>
    </div>
  )
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div>
      <span
        className={cn(
          'bg-emerald-100 px-1 py-0.5 font-bold text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500',
          className
        )}
      >
        {children}
      </span>
    </div>
  )
}

const CARDS = [
  {
    id: 0,
    name: 'Анна Иванова',
    designation: 'Довольный клиент',
    content: (
      <p>
        Этот сервис просто потрясающий! <Highlight>Мои фотографии</Highlight>{' '}
        превратились в настоящие произведения искусства. Рекомендую всем!
      </p>
    ),
  },
  {
    id: 1,
    name: 'Иван Петров',
    designation: 'Пользователь',
    content: (
      <p>
        Я был приятно удивлен качеством и скоростью работы.{' '}
        <Highlight>Мои аватары</Highlight> выглядят невероятно стильно и
        современно.
      </p>
    ),
  },
  {
    id: 2,
    name: 'Екатерина Смирнова',
    designation: 'Клиент',
    content: (
      <p>
        Отличный сервис! <Highlight>Индивидуальный подход</Highlight> и внимание
        к деталям сделали мой опыт незабываемым. Спасибо!
      </p>
    ),
  },
  {
    id: 3,
    name: 'Михаил Сергеев',
    designation: 'Регулярный клиент',
    content: (
      <p>
        Я постоянно пользуюсь этим сервисом. Качество всегда на высоте!{' '}
        <Highlight>Профессионализм</Highlight> команды не вызывает сомнений!
      </p>
    ),
  },
  {
    id: 4,
    name: 'Ольга Павлова',
    designation: 'Новый клиент',
    content: (
      <p>
        Впервые воспользовалась и осталась довольна. Все было сделано быстро и
        качественно. <Highlight>Советую</Highlight> всем, кто ценит свое время!
      </p>
    ),
  },
]
