import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface PricingPlan {
  title: string
  description: string
  discountedPrice: number
  price: number
  discountedLink: string
  link: string
}

interface CoursePricingProps {
  plans: PricingPlan[]
}

export function CoursePricing({ plans }: CoursePricingProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft')
    return savedTime ? parseInt(savedTime, 10) : 24 * 60 * 60
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0
        localStorage.setItem('timeLeft', newTime.toString())
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div>
      <div className='flex items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 px-6 py-4 text-white shadow-lg'>
        <Clock className='h-6 w-6 animate-pulse' />
        <div className='text-xl font-bold'>
          До конца акции осталось: {formatTime(timeLeft)}
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <div className='mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {plans.map((plan, index) => (
            <div
              key={index}
              className='flex h-full flex-col justify-between rounded-lg shadow-md transition-shadow hover:shadow-lg'
            >
              <div className={`rounded-t-lg p-4 text-white ${getColor(index)}`}>
                <h3 className='text-xl font-bold'>{plan.title}</h3>
              </div>
              <div className='flex flex-grow flex-col justify-between rounded-b-lg bg-gray-50 p-4'>
                <div>
                  <p
                    className='mb-4 text-gray-600'
                    dangerouslySetInnerHTML={{ __html: plan.description }}
                  ></p>
                  <div className='mb-2 text-center text-2xl font-bold text-gray-800'>
                    <p className='text-gray-400 line-through'>
                      {plan.price} руб
                    </p>
                    <p className='text-gray-800'>
                      {timeLeft > 0 && `${plan.discountedPrice} руб`}
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex justify-center'>
                  <a
                    href={timeLeft > 0 ? plan.discountedLink : plan.link}
                    className={`inline-block w-full px-8 py-3 ${getButtonColor(index)} transform rounded text-center font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl`}
                  >
                    {timeLeft > 0
                      ? `Купить за ${plan.discountedPrice} руб`
                      : `Купить за ${plan.price} руб`}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getColor(index: number) {
  const colors = [
    'bg-blue-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
  ]
  return colors[index % colors.length]
}

function getButtonColor(index: number) {
  const buttonColors = [
    'bg-gradient-to-r from-blue-500 to-blue-700',
    'bg-gradient-to-r from-pink-500 to-pink-700',
    'bg-gradient-to-r from-green-500 to-green-700',
    'bg-gradient-to-r from-purple-500 to-purple-700',
    'bg-gradient-to-r from-orange-500 to-orange-700',
  ]
  return buttonColors[index % buttonColors.length]
}
