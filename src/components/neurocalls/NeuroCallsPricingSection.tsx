import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline'

export function NeuroCallsPricingSection() {
  return (
    <div>
      <div className='mx-auto max-w-7xl px-2'>
        <h1 className='mb-8 text-center text-4xl font-bold text-gray-900 sm:text-5xl'>
          Стоимость услуги 💼
        </h1>
        <div className='grid grid-cols-1 gap-16 md:grid-cols-2'>
          <div className='rounded-xl bg-white p-10 shadow-lg'>
            <h2 className='mb-4 flex items-center text-2xl font-bold text-gray-800'>
              <SparklesIcon className='mr-2 h-6 w-6 text-yellow-500' />
              Нейрозвонки
            </h2>
            <ul className='list-inside list-disc space-y-4 text-gray-700'>
              <li>
                <span className='font-semibold'>6000$</span> — полная интеграция
                системы нейрозвонков в ваш бизнес. 🚀
              </li>
              <li>
                <span className='font-semibold'>
                  Специальное предложение для первых 10 клиентов:
                </span>{' '}
                3500$ 🎉
              </li>
              <li>
                <span className='font-semibold'>Условия:</span> Предоплата
                2500$, остаток оплачивается после полной интеграции и
                тестирования системы. 📅
              </li>
            </ul>
            <h3 className='mt-6 flex items-center text-xl font-bold text-gray-800'>
              <StarIcon className='mr-2 h-6 w-6 text-blue-500' />
              Ежемесячная подписка
            </h3>
            <ul className='list-inside list-disc space-y-4 text-gray-700'>
              <li>
                <span className='font-semibold'>1000$</span> — техническая
                поддержка, обновления и мониторинг системы. 🔄
              </li>
            </ul>
          </div>
          <div className='rounded-xl bg-white p-10 shadow-lg'>
            <h2 className='mb-4 flex items-center text-2xl font-bold text-gray-800'>
              <CheckCircleIcon className='mr-2 h-6 w-6 text-green-500' />
              Стоимость аналогичных услуг
            </h2>
            <ul className='list-inside list-decimal space-y-4 text-gray-700'>
              <li>
                Автоматизация клиентского сервиса:{' '}
                <span className='font-semibold'>От 5000$</span>. 📞
              </li>
              <li>
                Персонализированные решения на базе ИИ:{' '}
                <span className='font-semibold'>От 7000$</span>. 🧠
              </li>
              <li>
                Интеграция с CRM и другими бизнес-системами:{' '}
                <span className='font-semibold'>От 3500$</span>. 🔄
              </li>
            </ul>
            <p className='mt-6 font-semibold text-gray-900'>
              Общая стоимость аналогичных услуг:{' '}
              <span className='font-bold'>от 15 500$ в месяц</span>. 💰
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
