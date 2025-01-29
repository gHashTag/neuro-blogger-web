export function ContactSection({
  contact,
  hidePrice = false,
}: {
  contact: string
  hidePrice?: boolean
}) {
  return (
    <section className='relative py-16'>
      <div className='relative mx-auto max-w-7xl px-4'>
        <h2 className='mb-8 text-center text-4xl font-bold text-purple-700'>
          Готовы вывести свой SMM на новый уровень?
        </h2>
        <div className='rounded-lg bg-white bg-opacity-80 p-8 text-center shadow-lg'>
          <p className='mb-6 text-lg text-gray-700'>
            Оставьте заявку прямо сейчас и станьте одним из первых, кто
            воспользуется уникальным решением!
          </p>
          <div className='flex justify-center gap-4'>
            <a
              href={contact}
              className='inline-block rounded-full bg-purple-600 px-8 py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-purple-700'
            >
              Узнать больше
            </a>
            {!hidePrice && (
              <a
                href='https://auth.robokassa.ru/merchant/Invoice/epvKXOjlOUOox7FWbnAkYQ'
                className='inline-block rounded-full bg-pink-600 px-8 py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-pink-700'
              >
                Оплатить предоплату
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
