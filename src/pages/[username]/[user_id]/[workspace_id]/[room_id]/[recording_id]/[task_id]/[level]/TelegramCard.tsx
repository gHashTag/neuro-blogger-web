import React from 'react'
import InfoOverlay from './InfoOverlay'
import LevelBadge from './levelBadge'

interface TelegramCardProps {
  level: number
  videoSrc: string
  title: string
  is_ru: boolean
  link: string
  imageSrc: string
}

export default function TelegramCard({
  level,
  videoSrc,
  title,
  is_ru,
  link,
  imageSrc,
}: TelegramCardProps) {
  return (
    <div
      className='flex h-full w-full flex-col overflow-hidden shadow-lg'
      style={{ color: 'white' }}
    >
      <div className='relative flex-shrink-0 bg-blue-100'>
        <video
          src={videoSrc}
          className='h-full w-full object-cover'
          autoPlay
          loop
          poster={imageSrc}
        />
        <LevelBadge level={level} is_ru={is_ru} />
      </div>
      <InfoOverlay title={title} link={link} is_ru={is_ru} />
    </div>
  )
}
