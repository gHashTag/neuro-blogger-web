export function HeroHeading() {
  return (
    <div className='relative'>
      {/* Декоративный фоновый элемент */}
      <div className='absolute -inset-x-20 -inset-y-10'>
        <div className='h-full w-full animate-pulse opacity-30 blur-3xl'>
          <div className='absolute -inset-x-20 top-0 h-40 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mix-blend-multiply' />
          <div className='absolute -inset-x-20 bottom-0 h-40 bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 mix-blend-multiply' />
        </div>
      </div>

      {/* Основной заголовок */}
      <div className='relative space-y-4'>
        <h2 className='mb-2 text-lg font-semibold uppercase tracking-wider text-purple-600 sm:text-xl'>
          Революция в Instagram-маркетинге
        </h2>

        <h1 className='text-4xl font-bold leading-tight sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight'>
          <span className='animate-gradient mb-2 inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
            Создавай контент на автопилоте
          </span>
          <br />
          <span className='inline-block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            с помощью нейросетей
          </span>
        </h1>

        {/* Дополнительные преимущества */}
        <div className='mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-600'>
          <span className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-green-500' />
            Без опыта работы с ИИ
          </span>
          <span className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-blue-500' />
            Результат за 30 дней
          </span>
          <span className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-purple-500' />
            Поддержка 24/7
          </span>
        </div>
      </div>
    </div>
  )
}
