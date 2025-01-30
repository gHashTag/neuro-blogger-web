import React from 'react'
import { Clock, Users, CheckCircle, Globe, TrendingUp } from 'lucide-react'

export function NeuroCallsServiceBenefits() {
  const benefits = [
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Улучшение клиентского сервиса',
      description:
        'С помощью нейрозвонков можно анализировать и адаптировать коммуникации под индивидуальные потребности клиентов, повышая их удовлетворенность.',
    },
    {
      icon: <CheckCircle className='h-6 w-6' />,
      title: 'Снижение операционных расходов',
      description:
        'Автоматизация рутинных задач помогает снизить операционные расходы и оптимизировать расходы на персонал.',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      title: 'Повышение продаж',
      description:
        'Интеграция нейрозвонков может привести к повышению продаж за счет более эффективного взаимодействия с клиентами и быстрого реагирования на их потребности.',
    },
    {
      icon: <CheckCircle className='h-6 w-6' />,
      title: 'Повышение точности данных',
      description:
        'Автоматизация сбора и обработки данных с помощью нейрозвонков минимизирует ошибки и повышает точность информации.',
    },
    {
      icon: <Globe className='h-6 w-6' />,
      title: 'Многоязычная поддержка',
      description:
        'Нейрозвонки могут общаться с клиентами на множестве языков, что делает ваш сервис доступным для более широкой аудитории.',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Личный помощник для каждого клиента',
      description:
        'Нейрозвонки могут выступать в роли личных помощников, предоставляя клиентам информацию и поддержку в режиме реального времени.',
    },
  ]
  return (
    <div className='py-12'>
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
            Теперь ваш офис работает на вас!
          </p>
        </div>
      </div>
    </div>
  )
}
