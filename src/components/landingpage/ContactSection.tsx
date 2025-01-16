export function ContactSection() {
  return (
    <section className='relative bg-gradient-to-r from-purple-50 to-pink-50 py-16'>
      <div className='relative mx-auto max-w-7xl px-4'>
        <h2 className='mb-8 text-center text-4xl font-bold text-purple-700'>
          Контакты
        </h2>
        <div className='rounded-lg bg-white bg-opacity-80 p-8 text-center shadow-lg'>
          <p className='mb-6 text-lg text-gray-700'>
            У вас есть вопросы или хотите узнать больше? Свяжитесь с нашим
            менеджером, и мы с радостью поможем вам!
          </p>
          <a
            href='https://t.me/E_Zavarykin'
            className='inline-block rounded-full bg-purple-600 px-8 py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-purple-700'
            target='_blank'
            rel='noopener noreferrer'
          >
            Связаться с нами
          </a>
        </div>
      </div>
    </section>
  )
}
