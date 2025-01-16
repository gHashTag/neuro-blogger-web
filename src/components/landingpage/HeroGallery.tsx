import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    title: 'ИИ создает профессиональные фото',
    description: 'Автоматическая обработка и улучшение изображений',
    overlayColor: 'from-pink-500/20 to-purple-500/20',
  },
  {
    url: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=800',
    title: 'Умные алгоритмы для контента',
    description: 'Персонализированные рекомендации для вашей аудитории',
    overlayColor: 'from-blue-500/20 to-purple-500/20',
  },
  {
    url: 'https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?w=800',
    title: 'Автоматизация публикаций',
    description: 'Планирование и публикация постов в лучшее время',
    overlayColor: 'from-purple-500/20 to-pink-500/20',
  },
]

export function HeroGallery() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const galleryRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + galleryImages.length) % galleryImages.length
    )
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  // Параллакс эффект
  const handleMouseMove = (e: React.MouseEvent) => {
    if (galleryRef.current) {
      const rect = galleryRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
    }
  }

  const getParallaxStyle = (index: number) => {
    if (index !== currentSlide) return {}
    const xOffset = (mousePosition.x - 0.5) * 20
    const yOffset = (mousePosition.y - 0.5) * 20
    return {
      transform: `translate(${xOffset}px, ${yOffset}px) scale(1.1)`,
      transition: 'transform 0.2s ease-out',
    }
  }

  return (
    <div
      ref={galleryRef}
      onMouseMove={handleMouseMove}
      className='relative mx-auto mb-12 max-w-4xl px-4 sm:px-6 lg:px-8'
    >
      <div className='aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl sm:aspect-[2/1] lg:aspect-[2.4/1]'>
        <div className='relative h-full w-full'>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`absolute left-0 top-0 h-full w-full transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Фоновый градиент */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${image.overlayColor} z-10 mix-blend-overlay`}
              />

              {/* Изображение с параллакс эффектом */}
              <img
                src={image.url}
                alt={image.title}
                className='h-full w-full object-cover transition-transform duration-700 ease-out'
                style={getParallaxStyle(index)}
              />

              {/* Текстовый контент */}
              <div className='absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 sm:p-6 lg:p-8'>
                <div className='mx-auto max-w-2xl'>
                  <h3 className='mb-2 translate-y-0 transform text-xl font-bold text-white transition-transform duration-500 sm:text-2xl lg:text-3xl'>
                    {image.title}
                  </h3>
                  <p className='translate-y-0 transform text-sm text-gray-200 transition-transform delay-100 duration-500 sm:text-base'>
                    {image.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки навигации - скрыты на мобильных */}
      <div className='hidden sm:block'>
        <button
          onClick={prevSlide}
          className='absolute left-8 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
        >
          <ChevronLeft className='h-6 w-6 text-gray-800' />
        </button>
        <button
          onClick={nextSlide}
          className='absolute right-8 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
        >
          <ChevronRight className='h-6 w-6 text-gray-800' />
        </button>
      </div>

      {/* Индикаторы */}
      <div className='absolute -bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2'>
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-pink-500 sm:w-12'
                : 'bg-gray-300 hover:bg-pink-300'
            }`}
          />
        ))}
      </div>

      {/* Декоративные элементы */}
      <div className='absolute -inset-0.5 z-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-2xl' />
    </div>
  )
}
