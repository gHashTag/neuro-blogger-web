import React from 'react'
import InfoOverlay from './InfoOverlay'
import LevelBadge from './levelBadge'
import ReactPlayer from 'react-player'

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
    <div className='flex h-full w-full flex-col overflow-hidden text-white shadow-lg'>
      <div className='relative flex-shrink-0 bg-blue-100'>
        <ReactPlayer
          url={videoSrc}
          className='h-full w-full object-cover'
          playing={true}
          loop={true}
          muted={true}
          height='100%'
          width='100%'
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <LevelBadge level={level} is_ru={is_ru} />
      </div>
      <InfoOverlay title={title} link={link} is_ru={is_ru} />
    </div>
  )
}
