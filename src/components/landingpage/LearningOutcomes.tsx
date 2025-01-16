import { Brain, Users, DollarSign } from 'lucide-react'

export function LearningOutcomes() {
  const outcomes = [
    {
      icon: <Brain className='h-6 w-6' />,
      title: 'Навыки работы с ИИ',
      description:
        'Научитесь эффективно использовать ChatGPT, Midjourney, FLUX 1 и другие нейросети',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Клиентский портфель',
      description:
        'Сможете работать с клиентами и настраивать системы под их потребности',
    },
    {
      icon: <DollarSign className='h-6 w-6' />,
      title: 'Монетизация навыков',
      description:
        'Узнаете, как зарабатывать на настройке нейросетей для блогеров',
    },
  ]

  return (
    <div className='rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-8'>
      <h2 className='mb-8 text-center text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl'>
        Чему вы научитесь
      </h2>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {outcomes.map((outcome, index) => (
          <div
            key={index}
            className='rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl'
          >
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white'>
              {outcome.icon}
            </div>
            <h3 className='mb-2 text-lg font-bold text-gray-800'>
              {outcome.title}
            </h3>
            <p className='text-gray-600'>{outcome.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
