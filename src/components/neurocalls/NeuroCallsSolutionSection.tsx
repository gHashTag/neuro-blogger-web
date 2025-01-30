import React from 'react'
import { Sparkles, Image, Clock, Users, Zap, Target, Star } from 'lucide-react'

const solutions = [
  {
    icon: <Sparkles className='h-6 w-6' />,
    title: 'Генерация отчетов и аналитики',
    description: 'Уникальные данные, которые отражают ваши достижения и цели',
    color: 'from-orange-500 to-pink-500',
    bgColor: 'from-orange-50 to-pink-50',
  },
  {
    icon: <Image className='h-6 w-6' />,
    title: 'Автоматизация документооборота',
    description: 'Генерация и обработка документов без участия человека',
    color: 'from-pink-500 to-purple-500',
    bgColor: 'from-pink-50 to-purple-50',
  },
  {
    icon: <Clock className='h-6 w-6' />,
    title: 'Планирование и управление проектами',
    description: 'Задачи распределяются и выполняются в оптимальные сроки',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50 to-indigo-50',
  },
  {
    icon: <Users className='h-6 w-6' />,
    title: 'Автоматические ответы клиентам',
    description: 'Ваш цифровой помощник общается за вас',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-50 to-blue-50',
  },
  {
    icon: <Zap className='h-6 w-6' />,
    title: 'Ежедневные отчеты и обновления',
    description:
      'Информация обновляется каждый день для стабильного роста бизнеса',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
  },
  {
    icon: <Target className='h-6 w-6' />,
    title: 'Быстрый выход на новые рынки',
    description: 'Ваш офис работает на любом языке, представляя вас глобально',
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'from-cyan-50 to-teal-50',
  },
]

export function NeuroCallsSolutionSection() {
  return (
    <section>
      <div className='max-w-7xl px-4'>
        {/* Заголовок */}
        <div className='mb-16 px-4 text-center'>
          <span className='mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm text-purple-700 sm:text-base md:text-lg lg:text-xl'>
            <Star className='h- w-7 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9' />
            ИИ-Автоматизация
          </span>

          <h2 className='mb-6 mt-10 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl'>
            Представьте, что ваш офис работает эффективнее
          </h2>

          <p className='mx-auto max-w-xl text-base text-gray-600 sm:text-lg md:text-xl'>
            Нейросети возьмут на себя рутинные задачи, а вы сможете
            сосредоточиться на развитии
          </p>
        </div>

        {/* Сетка решений */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {solutions.map((solution, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-xl'
            >
              {/* Градиентный фон при наведении */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${solution.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* Контент */}
              <div className='relative'>
                {/* Иконка */}
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-r ${solution.color} mb-6 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  {solution.icon}
                </div>

                <h3 className='mb-2 text-xl font-bold text-gray-800 transition-colors group-hover:text-pink-600'>
                  {solution.title}
                </h3>
                <p className='text-gray-600'>{solution.description}</p>
              </div>

              {/* Декоративная линия */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${solution.color} transition-all duration-300 group-hover:w-full`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
