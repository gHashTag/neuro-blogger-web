import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline'

export function PricingSection() {
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
              Основные предложения
            </h2>
            <ul className='list-inside list-disc space-y-4 text-gray-700'>
              <li>
                <span className='font-semibold'>8000$</span> — полная разработка
                и запуск кастомного аватара. 🚀
              </li>
              <li>
                <span className='font-semibold'>
                  Специальное предложение для первых 5 клиентов:
                </span>{' '}
                3500$ 🎉
              </li>
              <li>
                <span className='font-semibold'>Условия:</span> Предоплата
                2500$, чтобы занять место. Остаток оплачивается после готовности
                через 2 недели. 📅
              </li>
            </ul>
            <h3 className='mt-6 flex items-center text-xl font-bold text-gray-800'>
              <StarIcon className='mr-2 h-6 w-6 text-blue-500' />
              Ежемесячная подписка
            </h3>
            <ul className='list-inside list-disc space-y-4 text-gray-700'>
              <li>
                <span className='font-semibold'>999$</span> — поддержка,
                автоматизация и развитие аватара. 🔄
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
                Создание контента (Reels, посты):{' '}
                <span className='font-semibold'>От 1000$ в месяц</span>. 📸
              </li>
              <li>
                Анализ ниши и стратегии продвижения:{' '}
                <span className='font-semibold'>От 1400$</span>. 📊
              </li>
              <li>
                Разработка лендинга и воронок продаж:{' '}
                <span className='font-semibold'>От 2100$</span>. 🌐
              </li>
              <li>
                Монтаж и поддержка (оператор, редактор):{' '}
                <span className='font-semibold'>От 1700$ в месяц</span>. 🎥
              </li>
              <li>
                Интеграция с нейросетями:{' '}
                <span className='font-semibold'>От 3500$</span>. 🤖
              </li>
              <li>
                Автоматизация автопостинга и работы в соцсетях:{' '}
                <span className='font-semibold'>От 1400$</span>. 📲
              </li>
            </ul>
            <p className='mt-6 font-semibold text-gray-900'>
              Общая стоимость аналогичных услуг:{' '}
              <span className='font-bold'>от 11 000$ в месяц</span>. 💰
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
