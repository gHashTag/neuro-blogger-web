import { useState } from 'react'
import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'

export function MainMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const tabs = [
    { name: 'Программа курса', href: '#course-program' },
    { name: 'Частые вопросы', href: '#faq' },
    { name: 'Тарифы', href: '#price' },
    { name: 'Контакты', href: '#contacts' },
  ]

  return (
    <nav className='bg-white shadow-md'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='flex items-center justify-between py-4'>
          <Link href='/' className='text-2xl font-bold text-pink-600'>
            НейроБлогер
          </Link>
          <div className='flex md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-700 hover:text-pink-600 focus:outline-none'
            >
              {isOpen ? (
                <XIcon className='h-6 w-6' />
              ) : (
                <MenuIcon className='h-6 w-6' />
              )}
            </button>
          </div>
          <div className='hidden space-x-4 md:flex'>
            {tabs.map((tab, index) => (
              <a
                key={index}
                href={tab.href}
                className='text-gray-700 transition-colors hover:text-pink-600'
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>
        {isOpen && (
          <div className='mt-2 space-y-2 rounded-lg bg-white p-4 shadow-lg md:hidden'>
            {tabs.map((tab, index) => (
              <a
                key={index}
                href={tab.href}
                className='block py-2 text-gray-700 transition-colors hover:text-pink-600'
                onClick={() => setIsOpen(false)}
              >
                {tab.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
