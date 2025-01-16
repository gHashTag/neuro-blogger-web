import { Code, Brain, Star, Globe, Rocket } from 'lucide-react'
import Image from 'next/image'

interface AuthorSectionProps {
  author: {
    name: string
    imageUrl: string
    description: string
    achievements: string[]
    achievementDescriptions: { [key: string]: string }
  }
}

export function AuthorSection({ author }: AuthorSectionProps) {
  return (
    <section className='px-4 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
          {/* Фото автора */}
          <div className='relative'>
            <div className='aspect-square overflow-hidden rounded-2xl shadow-lg'>
              <img
                alt='Author'
                src={author.imageUrl}
                className='h-full w-full object-cover'
              />
            </div>
          </div>

          {/* Информация об авторе */}
          <div className='rounded-lg bg-white p-8 shadow-lg'>
            <h2 className='mb-6 mt-8 text-4xl font-extrabold text-gray-600'>
              Об авторе курса
            </h2>
            <h3 className='mb-4 text-3xl font-semibold text-gray-900'>
              {author.name}
            </h3>
            <p className='mb-8 leading-relaxed text-gray-700'>
              {author.description}
            </p>

            {/* Достижения */}
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
              {author.achievements.map((achievement, index) => (
                <div key={index} className='flex items-start gap-4'>
                  {index === 0 && (
                    <Code className='h-8 w-8 flex-shrink-0 text-blue-600' />
                  )}
                  {index === 1 && (
                    <Brain className='h-8 w-8 flex-shrink-0 text-green-600' />
                  )}
                  {index === 2 && (
                    <Globe className='h-8 w-8 flex-shrink-0 text-purple-600' />
                  )}
                  {index === 3 && (
                    <Rocket className='h-8 w-8 flex-shrink-0 text-red-600' />
                  )}
                  <div>
                    <div className='text-lg font-semibold text-gray-800'>
                      {achievement}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {author.achievementDescriptions[achievement]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
