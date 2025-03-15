import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import md5 from 'md5'
import { MERCHANT_LOGIN, PASSWORD1, RESULT_URL2 } from '@/config'
import { setPayments } from '@/core/supabase'
import { Subscription } from '@/interfaces/supabase.interface'
import { useUser } from '@/hooks/useUser'
interface PricingPlan {
  title: string
  description: string
  discountedPrice: number
  price: number
  subscriptionType: string // Тип подписки (stars, neuroblogger и т.д.)
  stars?: number // Количество звезд, если применимо
}

interface CoursePricingProps {
  plans: PricingPlan[]
  botName: string
  userEmail?: string // Email пользователя, если он авторизован
}

// Функция сохранения платежа в базу данных

// Функция генерации платежной ссылки Робокассы
function generateRobokassaUrl(
  outSum: number,
  description: string,
  invId: number
): string {
  const merchantLogin = MERCHANT_LOGIN
  const password1 = PASSWORD1
  const resultUrl2 = RESULT_URL2

  const signatureValue = md5(
    `${merchantLogin}:${outSum}:${invId}:${encodeURIComponent(
      resultUrl2
    )}:${password1}`
  ).toUpperCase()

  const url = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=${merchantLogin}&OutSum=${outSum}&InvId=${invId}&Description=${encodeURIComponent(
    description
  )}&SignatureValue=${signatureValue}&ResultUrl2=${encodeURIComponent(
    resultUrl2
  )}`

  return url
}

export function CoursePricing({
  plans,
  botName,
  userEmail,
}: CoursePricingProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft')
    return savedTime ? parseInt(savedTime, 10) : 24 * 60 * 60
  })

  const { telegram_id } = useUser()
  // Состояние для хранения email, если пользователь неавторизован

  const [isLoading, setIsLoading] = useState(false)

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

  // Функция создания счета и перехода к оплате
  const handlePurchase = async (
    plan: PricingPlan,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      // Выбираем цену в зависимости от состояния таймера
      const price = timeLeft > 0 ? plan.discountedPrice : plan.price

      // Генерируем уникальный номер заказа
      const invId = Math.floor(Date.now() / 1000)

      // Формируем описание заказа
      const description = `Покупка "${plan.subscriptionType}"`

      // Сохраняем информацию о платеже в базу данных
      await setPayments({
        email: '',
        OutSum: price.toString(),
        InvId: invId.toString(),
        currency: 'RUB',
        stars: plan.stars || 0,
        status: 'PENDING',
        payment_method: 'Robokassa',
        subscription: plan.subscriptionType as Subscription,
        language: navigator.language,
        telegram_id: telegram_id.toString(),
        bot_name: botName,
      })

      // Генерируем URL и переходим по нему
      const paymentUrl = generateRobokassaUrl(price, description, invId)
      console.log(paymentUrl, 'paymentUrl')

      // Сохраняем данные о заказе в localStorage
      localStorage.setItem(
        'lastOrder',
        JSON.stringify({
          invId,
          planTitle: plan.title,
          price,
          email: '',
          timestamp: Date.now(),
        })
      )

      // Перенаправляем на страницу оплаты
      window.location.href = paymentUrl
    } catch (error) {
      console.error('Ошибка при создании заказа:', error)
      alert(
        'Произошла ошибка при создании заказа. Пожалуйста, попробуйте позже.'
      )
    } finally {
      setIsLoading(false)
    }
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
        <div className='mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
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
                    href='#'
                    onClick={e => handlePurchase(plan, e)}
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
