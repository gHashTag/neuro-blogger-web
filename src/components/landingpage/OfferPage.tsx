import React from 'react'
import {
  Brain,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Globe,
  Code,
  MessageCircle,
  Calendar,
} from 'lucide-react'

export function OfferPage() {
  const offers = [
    {
      icon: <Star className='h-6 w-6' />,
      title: 'Кастомный подход',
      description:
        'Разработка и обучение уникального аватара, который полностью отражает ваш стиль и ведёт блог за вас 24/7.',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      title: 'Маркетинговый анализ вашей ниши',
      description:
        'Полный анализ конкурентов и целевой аудитории для повышения эффективности контента.',
    },
    {
      icon: <Globe className='h-6 w-6' />,
      title: 'Рекламная интеграция авто-продуктов',
      description:
        'Ваш аватар может рекламировать наши продукты и услуги по автоматизации SMM и бизнеса, выполняя роль инфлюенсера.',
    },
    {
      icon: <MessageCircle className='h-6 w-6' />,
      title: 'Техническая поддержка и сопровождение',
      description: 'Полный монтаж контента и управление аватаром “под ключ”.',
    },
    {
      icon: <Calendar className='h-6 w-6' />,
      title: 'Генерация Reels на основе вирусных сценариев',
      description:
        'Сценарии создаются на базе самых успешных трендов из социальных сетей.',
    },
    {
      icon: <Brain className='h-6 w-6' />,
      title: 'Кодовые триггерные слова и нейроворонка',
      description:
        'Оптимизация текстов и контента для увеличения вовлечённости и продаж.',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Интеграция с нейросетями',
      description:
        'Обучение аватара работать на основе ваших данных для создания уникального контента.',
    },
    {
      icon: <MessageCircle className='h-6 w-6' />,
      title: 'Телеграм-бот',
      description: 'Управление блогом с любого устройства в любое время.',
    },
    {
      icon: <Calendar className='h-6 w-6' />,
      title: 'Автопостинг на всех платформах',
      description:
        'Instagram, TikTok, YouTube и другие соцсети с публикацией в оптимальное время.',
    },
  ]

  return (
    <div className='min-h-screen py-12'>
      <div className='mx-auto max-w-7xl px-4'>
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
