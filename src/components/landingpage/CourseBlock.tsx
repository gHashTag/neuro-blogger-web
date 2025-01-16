import { Book, Video, MessageCircle, Sparkles } from 'lucide-react'

export function CourseBlock() {
  const features = [
    {
      icon: <Book className='h-5 w-5' />,
      title: 'Доступ к курсу навсегда',
      description: 'Обучайтесь в своем темпе',
    },
    {
      icon: <Video className='h-5 w-5' />,
      title: '12+ практических уроков',
      description: 'С проверкой и обратной связью',
    },
    {
      icon: <MessageCircle className='h-5 w-5' />,
      title: 'Поддержка кураторов 24/7',
      description: 'Помощь на каждом этапе',
    },
  ]

  const bonuses = [
    {
      icon: '✨',
      title: 'Готовые промпты',
      description: 'Библиотека проверенных промптов для разных задач',
    },
    {
      icon: '📋',
      title: 'Чек-листы',
      description: 'Пошаговые инструкции для работы с нейросетями',
    },
    {
      icon: '🎯',
      title: 'Шаблоны',
      description: 'Набор готовых шаблонов для разных типов постов',
    },
  ]

  return (
    <section className='bg-gradient-to-b from-purple-50/50 to-pink-50/50 py-20'>
      <div className='mx-auto max-w-7xl px-4'>
        {/* Заголовок */}
        <div className='mb-16 text-center'>
          <span className='mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700'>
            <Sparkles className='h-4 w-4' />
            Специальное предложение
          </span>

          <h2 className='mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl'>
            Присоединяйтесь к курсу сейчас
          </h2>

          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            Получите полный набор инструментов для автоматизации ваших
            социальных сетей
          </p>
        </div>

        {/* Основные преимущества */}
        <div className='mb-16 grid gap-6 md:grid-cols-3'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group flex flex-col items-center rounded-2xl p-6 text-center transition-all hover:bg-white hover:shadow-lg'
            >
              <div className='mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white transition-transform group-hover:scale-110'>
                {feature.icon}
              </div>
              <h3 className='mb-2 text-lg font-bold text-gray-800'>
                {feature.title}
              </h3>
              <p className='text-gray-600'>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Бонусы */}
        <div className='mx-auto max-w-6xl'>
          <h3 className='mb-8 text-center text-xl font-bold'>Бонусы к курсу</h3>
          <div className='grid gap-6 md:grid-cols-3'>
            {bonuses.map((bonus, index) => (
              <div
                key={index}
                className='flex flex-col items-center rounded-xl bg-white p-6 text-center transition-all hover:shadow-lg'
              >
                <div className='mb-4 text-3xl'>{bonus.icon}</div>
                <div>
                  <h4 className='mb-2 font-bold text-gray-800'>
                    {bonus.title}
                  </h4>
                  <p className='text-sm text-gray-600'>{bonus.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
