import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const pricingData = [
  {
    service: 'Полная разработка и запуск кастомного аватара',
    ourPrice: '8000$',
    marketPrice: '-',
  },
  {
    service: 'Поддержка, автоматизация и развитие аватара (в месяц)',
    ourPrice: '1900$',
    marketPrice: '11 000$',
  },
  {
    service: 'Специальное предложение для первых 5 клиентов',
    ourPrice: '3500$',
    marketPrice: '-',
  },
]

export function PricingSection() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12'>
      <div className='mx-auto max-w-5xl px-4'>
        <h1 className='mb-8 text-center text-4xl font-bold text-gray-900 sm:text-5xl'>
          Стоимость услуги
        </h1>
        <div className='overflow-x-auto'>
          <table className='min-w-full rounded-xl bg-white shadow-lg'>
            <thead>
              <tr>
                <th className='border-b-2 border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm uppercase leading-4 tracking-wider text-gray-600'>
                  Услуга
                </th>
                <th className='border-b-2 border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm uppercase leading-4 tracking-wider text-gray-600'>
                  Наша цена
                </th>
                <th className='border-b-2 border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm uppercase leading-4 tracking-wider text-gray-600'>
                  Рыночная цена
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {pricingData.map((item, index) => (
                <tr key={index}>
                  <td className='whitespace-no-wrap flex items-center border-b border-gray-200 px-6 py-4'>
                    <CheckCircleIcon className='mr-2 h-5 w-5 text-green-500' />
                    {item.service}
                  </td>
                  <td className='whitespace-no-wrap border-b border-gray-200 px-6 py-4'>
                    {item.ourPrice}
                  </td>
                  <td className='whitespace-no-wrap border-b border-gray-200 px-6 py-4'>
                    {item.marketPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-8 rounded-xl bg-white p-6 shadow-lg'>
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>
            Реальная стоимость аналогичных услуг на рынке (без автоматизации):
          </h2>
          <ul className='list-inside list-disc space-y-2 text-gray-700'>
            <li>Создание контента (Reels, посты): От 1000$ в месяц.</li>
            <li>Анализ ниши и стратегии продвижения: От 1400$.</li>
            <li>Разработка лендинга и воронок продаж: От 2100$.</li>
            <li>Монтаж и поддержка (оператор, редактор): От 1700$ в месяц.</li>
            <li>Интеграция с нейросетями: От 3500$.</li>
            <li>Автоматизация автопостинга и работы в соцсетях: От 1400$.</li>
          </ul>
          <p className='mt-6 font-semibold text-gray-900'>
            Общая стоимость аналогичных услуг: от 11 000$ в месяц.
          </p>
        </div>
      </div>
    </div>
  )
}
