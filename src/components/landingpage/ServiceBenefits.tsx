import React from 'react'
import {
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Globe,
  TrendingUp,
} from 'lucide-react'

export function ServiceBenefits() {
  const benefits = [
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Экономия времени',
      description:
        'Сократите часы работы над контентом до минут, передав рутину вашему аватару.',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Рост медийности и подписчиков',
      description:
        'Ваш блог активно развивается, пока вы отдыхаете, путешествуете или проводите время с семьёй.',
    },
    {
      icon: <CheckCircle className='h-6 w-6' />,
      title: 'Высокое качество контента',
      description: 'Визуалы и тексты соответствуют современным стандартам.',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      title: 'Ежедневный выход Reels',
      description:
        'Стабильное создание контента для удержания и привлечения аудитории.',
    },
    {
      icon: <Globe className='h-6 w-6' />,
      title: 'Глобальный охват',
      description:
        'Благодаря мульти-языковому контенту ваш бренд становится узнаваемым по всему миру.',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      title: 'Высокая конверсия в продажи',
      description: 'Контент, который превращает подписчиков в клиентов.',
    },
  ]

  return (
    <div className='min-h-screen py-12'>
      <div className='mx-auto max-w-7xl px-4'>
        <h1 className='mb-12 text-center text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl'>
          Преимущества услуги
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className='rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl'
            >
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white'>
                {benefit.icon}
              </div>
              <h3 className='mb-2 text-lg font-bold text-gray-800'>
                {benefit.title}
              </h3>
              <p className='text-gray-600'>{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <p className='text-3xl font-semibold text-yellow-400'>
            Теперь ваш блог работает на вас, а не наоборот!
          </p>
        </div>
      </div>
    </div>
  )
}
