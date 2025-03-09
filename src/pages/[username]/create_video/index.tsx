'use client'

import { useState, useEffect } from 'react'
import { Loader } from '@/components'

export default function VideoPlayerComponent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Загружаем плеер динамически
    const loadRevideoPlayer = async () => {
      try {
        // Вместо импорта из @revideo, создаем простой компонент-плейсхолдер
        const RevideoPlayer = () => (
          <div className='flex aspect-video items-center justify-center rounded-lg bg-black'>
            <p className='text-white'>Revideo Player Placeholder</p>
            <p className='mt-2 text-sm text-gray-400'>
              (Для настоящего плеера требуется отдельный запуск через CLI)
            </p>
          </div>
        )

        setLoading(false)
      } catch (error) {
        console.error('❌ Ошибка загрузки плеера:', error)
        setError(String(error))
        setLoading(false)
      }
    }

    loadRevideoPlayer()
  }, [])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className='mx-auto max-w-2xl rounded-lg border border-red-300 bg-red-50 p-6'>
        <h3 className='mb-2 text-lg font-bold text-red-700'>
          Ошибка загрузки @revideo:
        </h3>
        <p className='text-red-600'>{error}</p>

        <div className='mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4'>
          <p className='font-medium text-amber-800'>Рекомендации:</p>
          <ul className='mt-2 list-disc pl-5 text-amber-700'>
            <li>
              Запустите @revideo отдельно через CLI:{' '}
              <code>npm run revideo:serve</code>
            </li>
            <li>Проверьте совместимость версий @revideo с Next.js</li>
            <li>
              В production режиме используйте отдельное приложение на Vite для
              @revideo
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
