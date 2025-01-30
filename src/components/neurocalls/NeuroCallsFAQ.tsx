import { ChevronDown } from 'lucide-react'

export function NeuroCallsFAQ() {
  const faqs = [
    {
      question: 'Что такое нейрозвонки?',
      answer:
        'Нейрозвонки — это автоматизированная система, использующая искусственный интеллект для совершения и обработки звонков, что позволяет улучшить коммуникацию с клиентами и оптимизировать рабочие процессы.',
    },
    {
      question: 'Какие преимущества предоставляют нейрозвонки?',
      answer:
        'Нейрозвонки позволяют автоматизировать рутинные задачи, улучшить качество обслуживания клиентов, снизить операционные расходы и повысить общую эффективность бизнеса.',
    },
    {
      question: 'Нужны ли специальные знания для работы с нейрозвонками?',
      answer:
        'Нет, наша система нейрозвонков разработана таким образом, чтобы ею могли пользоваться пользователи без специальных технических знаний. Мы предоставляем полную поддержку и обучение.',
    },
    {
      question: 'Как быстро можно интегрировать нейрозвонки в мой бизнес?',
      answer:
        'Интеграция нейрозвонков может быть выполнена в течение нескольких дней, в зависимости от специфики вашего бизнеса и требуемой настройки системы.',
    },
    {
      question: 'Какие функции поддерживают нейрозвонки?',
      answer:
        'Нейрозвонки поддерживают автоматическое распознавание речи, синтез речи, интеграцию с CRM-системами, анализ эмоций и многое другое.',
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
