import { ChevronDown } from 'lucide-react'

export function FAQ() {
  const faqs = [
    {
      question: 'Нужен ли опыт работы с ИИ?',
      answer:
        'Нет, курс подходит даже для полных новичков. Мы начинаем с самых основ и постепенно переходим к продвинутым техникам.',
    },
    {
      question: 'Сколько времени занимает обучение?',
      answer:
        'Программа рассчитана на 30 дней. В среднем потребуется 1-2 часа в день для изучения материалов и выполнения практических заданий.',
    },
    {
      question: 'Какое оборудование необходимо?',
      answer:
        'Достаточно иметь компьютер или ноутбук с доступом в интернет. Все необходимые инструменты доступны онлайн.',
    },
    {
      question: 'Как проходит обучение?',
      answer:
        'Обучение проходит в формате онлайн через личный кабинет. Каждый день вы получаете новый урок с практическим заданием.',
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
