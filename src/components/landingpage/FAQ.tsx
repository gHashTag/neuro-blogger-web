import { ChevronDown } from 'lucide-react'

export function FAQ() {
  const faqs = [
    {
      question: 'Как работает ваш AI-аватар?',
      answer:
        'Наш AI-аватар обучается на основе ваших данных и стиля, чтобы создавать контент, который полностью отражает вашу личность и ценности.',
    },
    {
      question: 'Нужен ли опыт работы с ИИ для использования услуги?',
      answer:
        'Нет, наш сервис подходит даже для новичков. Мы предоставляем полную поддержку и обучение по работе с аватаром.',
    },
    {
      question: 'Как быстро я увижу результаты?',
      answer:
        'Вы начнете замечать рост охватов и вовлеченности уже в первые недели после запуска аватара.',
    },
    {
      question: 'Какие платформы поддерживаются для автопостинга?',
      answer:
        'Мы поддерживаем автопостинг на Instagram, TikTok, YouTube и других популярных платформах.',
    },
    {
      question: 'Как я могу управлять своим блогом?',
      answer:
        'Вы можете управлять блогом через наш телеграм-бот, доступный с любого устройства в любое время.',
    },
    {
      question: 'Что входит в ежемесячную подписку?',
      answer:
        'Подписка включает поддержку, автоматизацию и развитие вашего аватара, а также регулярное обновление контента.',
    },
  ]

  return (
    <div className='rounded-2xl bg-white p-8'>
      <h2 className='mb-8 text-center text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl'>
        Частые вопросы
      </h2>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <details key={index} className='group'>
            <summary className='flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100'>
              <span className='font-medium text-gray-800'>{faq.question}</span>
              <ChevronDown className='h-5 w-5 text-gray-500 transition-transform group-open:rotate-180' />
            </summary>
            <div className='p-4 text-gray-600'>{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  )
}
