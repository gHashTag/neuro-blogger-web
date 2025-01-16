import React from 'react'
import { Check } from 'lucide-react'
import { Button } from './Button'

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  isPopular?: boolean
}

export function PricingCard({
  title,
  price,
  features,
  isPopular = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 ${
        isPopular
          ? 'border-2 border-pink-500 bg-gradient-to-b from-pink-50 to-purple-50'
          : 'border border-gray-200 bg-white'
      }`}
    >
      {isPopular && (
        <span className='absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1 text-sm font-medium text-white'>
          Популярный выбор
        </span>
      )}
      <h3 className='mb-4 text-2xl font-bold'>{title}</h3>
      <div className='mb-6'>
        <span className='text-4xl font-bold'>{price}</span>
        <span className='text-gray-600'>₽</span>
      </div>
      <ul className='mb-8 space-y-4'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-center gap-3'>
            <Check className='h-5 w-5 text-pink-500' />
            <span className='text-gray-700'>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={isPopular ? 'primary' : 'secondary'}
        className={`w-full ${isPopular ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' : ''}`}
      >
        Выбрать тариф
      </Button>
    </div>
  )
}
