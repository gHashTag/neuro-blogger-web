import React from 'react'
import Image from 'next/image'
import LandingIcons from '@components/assets/LandingIcons'
import { BackgroundGradient } from '@/components/ui/background-gradient'

type SubCardProps = {
  title: string
  img: string
  onClick: () => void
  isDisabled?: boolean
}

const SubCard: React.FC<SubCardProps> = ({
  title,
  img,
  onClick,
  isDisabled,
}) => {
  return (
    <a
      onClick={isDisabled ? () => {} : onClick}
      className={`${
        isDisabled
          ? 'cursor-not-allowed'
          : 'cursor-pointer transition duration-300 ease-in-out'
      }`}
    >
      <BackgroundGradient>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Image
            src={img}
            alt={title ?? 'landing-card'}
            width={500}
            height={300}
            className='h-auto w-full object-contain'
            priority={true}
          />
        </div>
        <div className='flex items-center justify-center'>
          {LandingIcons[title]}
        </div>
        <div
          className='mt-2 flex items-center justify-center text-base text-lg font-medium text-slate-900 md:text-xl lg:text-2xl'
          style={{ marginBottom: 20 }}
        >
          {title}
        </div>
      </BackgroundGradient>
    </a>
  )
}
export default React.memo(SubCard)
