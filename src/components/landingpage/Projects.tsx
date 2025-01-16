export function Projects() {
  const projects = [
    {
      title: 'Личный ИИ-аватар',
      description:
        'Создадите своего цифрового двойника с уникальным голосом и внешностью',
      tools: ['ElevenLabs', 'FLUX 1', 'CapCat'],
    },
    {
      title: 'Автоматическая нейроворонка',
      description:
        'Настроите систему автоматического создания и публикации контента',
      tools: ['ChatGPT', 'Midjourney', 'Buffer'],
    },
    {
      title: 'Клиентский кейс',
      description: 'Проведете полную настройку системы для реального клиента',
      tools: ['Все изученные инструменты'],
    },
  ]

  return (
    <div className='rounded-2xl bg-white p-8'>
      <h2 className='mb-8 text-center text-3xl font-bold'>
        Практические проекты
      </h2>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {projects.map((project, index) => (
          <div
            key={index}
            className='group relative rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 transition-all hover:shadow-xl'
          >
            <h3 className='mb-3 text-xl font-bold'>{project.title}</h3>
            <p className='mb-4 text-gray-600'>{project.description}</p>
            <div className='space-y-2'>
              {project.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className='mb-2 mr-2 inline-block rounded-full bg-white px-3 py-1 text-sm text-pink-600'
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
