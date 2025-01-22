import React from 'react'
import InfoOverlay from './InfoOverlay'
import LevelBadge from './levelBadge'
interface TelegramCardProps {
  level: number
  imageSrc: string
  title: string
  is_ru: boolean
  link: string
}

export default function TelegramCard({
  level,
  imageSrc,
  title,
  is_ru,
  link,
}: TelegramCardProps) {
  return (
    <div className='flex h-full w-full flex-col overflow-hidden shadow-lg'>
      <div className='relative flex-shrink-0 bg-blue-100'>
        <img
          src={imageSrc}
          alt='Avatar'
          className='h-full w-full object-cover'
        />
        <LevelBadge level={level} is_ru={is_ru} />
      </div>
      <InfoOverlay title={title} link={link} is_ru={is_ru} />
    </div>
  )
}
