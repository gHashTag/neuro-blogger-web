import React from 'react'
import {
  Brain,
  Users,
  Star,
  TrendingUp,
  Globe,
  MessageCircle,
  Calendar,
} from 'lucide-react'

const offers = [
  {
    icon: <TrendingUp className='h-6 w-6' />,
    title: 'Оптимизация бизнес-процессов',
    description:
      'Автоматизация и оптимизация ключевых бизнес-процессов для повышения общей производительности и снижения затрат.',
  },
  {
    icon: <Brain className='h-6 w-6' />,
    title: 'Решения на базе ИИ',
    description:
      'Разработка индивидуальных решений на базе искусственного интеллекта для улучшения качества обслуживания и увеличения прибыли.',
  },
  {
    icon: <Star className='h-6 w-6' />,
    title: 'VIP-обслуживание',
    description:
      'Эксклюзивные услуги и предложения для VIP-клиентов, включая персонализированное обслуживание и специальные условия.',
  },
  {
    icon: <Calendar className='h-6 w-6' />,
    title: 'Управление проектами',
    description:
      'Инструменты и сервисы для эффективного управления проектами, позволяющие синхронизировать работу команд и следить за сроками.',
  },
  {
    icon: <Users className='h-6 w-6' />,
    title: 'Обучение и развитие',
    description:
      'Программы обучения и развития для сотрудников, направленные на повышение квалификации и профессионального роста.',
  },
  {
    icon: <Brain className='h-6 w-6' />,
    title: 'Безопасность данных',
    description:
      'Обеспечение высокого уровня безопасности корпоративных данных с использованием передовых технологий шифрования и защиты информации.',
  },
]

export function NeuroCallsOfferPage() {
  return (
    <div>
      <div className='mx-auto max-w-7xl px-4 py-16'>
        <h1 className='mb-12 text-center text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl'>
          Что мы предлагаем?
        </h1>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {offers.map((offer, index) => (
            <div
              key={index}
              className='rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl'
            >
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white'>
                {offer.icon}
              </div>
              <h3 className='mb-2 text-lg font-bold text-gray-800'>
                {offer.title}
              </h3>
              <p className='text-gray-600'>{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
