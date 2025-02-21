'use client'

import type React from 'react'
import Image from 'next/image'

type NavbarProps = {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className='border-custom-1 absolute left-0 top-0 z-10 flex h-16 w-full items-center justify-between border-b px-10 text-slate-100'>
      <Image
        src='/images/Logo.png'
        alt='logo'
        width={180}
        height={180}
        className='object-contain'
        quality={100}
        priority
      />
    </header>
  )
}
export default Navbar
