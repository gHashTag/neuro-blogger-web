import {
  Book,
  Video,
  MessageCircle,
  UserCheck,
  FileText,
  Gift,
} from 'lucide-react'

export function CourseContent() {
  const features = [
    {
      icon: <Book className='h-6 w-6' />,
      title: '5 модулей пошагового обучения',
      description: 'Структурированная программа для быстрого старта',
    },
    {
      icon: <Video className='h-6 w-6' />,
      title: '12 +практических уроков',
      description: 'Подробные видео-инструкции с примерами',
    },
    {
      icon: <MessageCircle className='h-6 w-6' />,
      title: 'Доступ к закрытому чату',
      description: 'Общение с единомышленниками и обмен опытом',
    },
    {
      icon: <UserCheck className='h-6 w-6' />,
      title: 'Персональные консультации',
      description: 'Индивидуальная поддержка от экспертов',
    },
    {
      icon: <FileText className='h-6 w-6' />,
      title: 'Готовые шаблоны и инструкции',
      description: 'Проверенные материалы для быстрого результата',
    },
    {
      icon: <Gift className='h-6 w-6' />,
      title: 'Бонусные материалы',
      description: 'Дополнительные ресурсы для развития блога',
    },
  ]

  return (
    <div className='rounded-2xl bg-white p-8'>
      <h2 className='mb-8 text-center text-3xl font-bold'>
        Что вы получите в курсе?
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='rounded-xl border border-gray-200 p-6 transition-all hover:border-pink-500'
          >
            <div className='mb-4 text-pink-500'>{feature.icon}</div>
            <h3 className='mb-2 text-lg font-bold'>{feature.title}</h3>
            <p className='text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
