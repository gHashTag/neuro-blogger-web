import {
  XCircle,
  AlertTriangle,
  TrendingDown,
  Clock,
  ImageOff,
  Users,
  Target,
} from 'lucide-react'

interface ProblemSectionProps {
  problemData: {
    titles: string[]
    descriptions: string[]
  }
}

export function ProblemSection({ problemData }: ProblemSectionProps) {
  const problems = [
    {
      icon: <Clock className='h-6 w-6' />,
      color: 'from-orange-500 to-pink-500',
      bgColor: 'from-orange-50 to-pink-50',
    },
    {
      icon: <AlertTriangle className='h-6 w-6' />,
      color: 'from-pink-500 to-purple-500',
      bgColor: 'from-pink-50 to-purple-50',
    },
    {
      icon: <TrendingDown className='h-6 w-6' />,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
    },
    {
      icon: <ImageOff className='h-6 w-6' />,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
    },
    {
      icon: <Users className='h-6 w-6' />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      icon: <Target className='h-6 w-6' />,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
    },
  ]

  return (
    <section className='py-10'>
      <div className='mx-auto max-w-7xl px-4'>
        {/* Заголовок */}
        <div className='relative mb-16 text-center'>
          <h2 className='mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl'>
            Знакомые трудности?
          </h2>

          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            95% блогеров сталкиваются с этими проблемами ежедневно. Но теперь
            есть решение
          </p>
        </div>

        {/* Сетка проблем */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {problems.map((problem, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-xl'
            >
              {/* Градиентный фон при наведении */}
              <div
                className='absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-5'
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />

              {/* Иконка */}
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-r ${problem.bgColor} mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
              >
                <div
                  className={`h-8 w-8 rounded-lg bg-gradient-to-r ${problem.color} flex items-center justify-center text-white`}
                >
                  {problem.icon}
                </div>
              </div>

              {/* Контент */}
              <h3 className='mb-2 mt-4 text-xl font-bold text-black transition-colors group-hover:text-pink-600'>
                {problemData.titles[index]}
              </h3>
              <p className='mb-4 text-gray-600'>
                {problemData.descriptions[index]}
              </p>

              {/* Декоративная линия */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${problem.color} transition-all duration-300 group-hover:w-full`}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className='mt-12 text-center'>
          <button className='inline-flex items-center gap-2 text-3xl font-semibold text-pink-600 transition-colors hover:text-pink-700'>
            <svg
              className='mt-2 h-8 w-8 rotate-180 transform animate-bounce'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 14l-7 7m0 0l-7-7m7 7V3'
              />
            </svg>
            Узнать, как решить эти проблемы
            <svg
              className='mt-2 h-8 w-8 animate-bounce'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 14l-7 7m0 0l-7-7m7 7V3'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
