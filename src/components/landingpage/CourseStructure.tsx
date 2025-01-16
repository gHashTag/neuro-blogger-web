import { Clock, CheckCircle, ChevronRight } from 'lucide-react'

export function CourseStructure() {
  const modules = [
    {
      title: 'Нулевая ступень',
      subtitle: 'Знакомство с миром ИИ',
      description: 'Базовые знания и подготовка к работе с нейросетями',
      duration: '2 недели',
      lessons: [
        'Добро пожаловать в мир ИИ',
        'Основы работы с ИИ',
        'Учимся учиться',
      ],
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Первая ступень',
      subtitle: 'Создание личного бренда',
      description: 'Настройка и запуск вашего блога с помощью ИИ',
      duration: '4 недели',
      lessons: [
        'Введение в нейросети',
        'Создание контента',
        'Автоматизация процессов',
      ],
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Вторая ступень',
      subtitle: 'Работа с клиентами',
      description: 'Настройка нейросетей под блоги клиентов',
      duration: '4 недели',
      lessons: [
        'Анализ блога клиента',
        'Настройка инструментов',
        'Запуск системы',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
  ]

  return (
    <div className='rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-xl md:p-12'>
      <h2 className='mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent'>
        Программа обучения
      </h2>
      <p className='mx-auto mb-12 max-w-2xl text-center text-gray-600'>
        Пошаговый путь от новичка до профессионала в работе с ИИ
      </p>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {modules.map((module, index) => (
          <div
            key={index}
            className='group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-2xl'
          >
            {/* Номер модуля */}
            <div
              className={`absolute -top-4 left-6 h-8 w-8 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center font-bold text-white shadow-lg`}
            >
              {index + 1}
            </div>

            {/* Заголовок и описание */}
            <div className='mt-4'>
              <h3 className='mb-1 text-xl font-bold transition-colors group-hover:text-pink-600'>
                {module.title}
              </h3>
              <h4 className='mb-3 text-lg font-semibold text-gray-600'>
                {module.subtitle}
              </h4>
              <p className='mb-4 text-sm text-gray-600'>{module.description}</p>

              {/* Длительность */}
              <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-sm text-pink-600'>
                <Clock className='h-4 w-4' />
                {module.duration}
              </div>

              {/* Уроки */}
              <div className='flex-grow space-y-3'>
                {module.lessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className='flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors group-hover:bg-pink-50'
                  >
                    <div className='flex-shrink-0'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    </div>
                    <span className='text-sm font-medium text-gray-700'>
                      {lesson}
                    </span>
                  </div>
                ))}
              </div>

              {/* Кнопка "Подробнее" */}
              <button className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 px-4 py-2 text-pink-600 transition-colors hover:bg-pink-50 hover:text-pink-700'>
                Подробнее о модуле
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
