import React, { useState } from 'react'
import InfoOverlay from './InfoOverlay'
import LevelBadge from './levelBadge'
import ReactPlayer from 'react-player'
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import Image from 'next/image'
interface TelegramCardProps {
  level: number
  videoSrc?: string
  title: string
  is_ru: boolean
  link: string
  imageSrc: string
  allLevelsCompleted: boolean
}

export default function TelegramCard({
  level,
  videoSrc,
  title,
  is_ru,
  link,
  imageSrc,
  allLevelsCompleted,
}: TelegramCardProps) {
  const [muted, setMuted] = useState(true)

  return (
    <div className='flex h-full w-full flex-col overflow-hidden text-white shadow-lg'>
      <div className='flex flex-col items-center justify-center bg-white p-3' />
      <div className='relative flex-shrink-0 bg-white'>
        <div className='video-container'>
          {videoSrc ? (
            <ReactPlayer
              url={videoSrc}
              className='pointer-events-none h-full w-full object-cover'
              playing={true}
              loop={true}
              muted={muted}
              height='100%'
              width='100%'
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                objectFit: 'cover',
                zIndex: -1,
              }}
            />
          ) : (
            <Image
              src={imageSrc}
              alt='image'
              height='800'
              width='430'
              style={{
                objectFit: 'cover',
                zIndex: -1,
              }}
              className='pointer-events-none object-cover'
            />
          )}
          {videoSrc && (
            <button
              onClick={() => setMuted(!muted)}
              className='absolute right-4 top-3 rounded-full bg-gray-800 bg-opacity-50 p-2'
            >
              {muted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
            </button>
          )}
        </div>
        <LevelBadge level={level} is_ru={is_ru} />
      </div>
      <InfoOverlay
        title={title}
        link={link}
        is_ru={is_ru}
        allLevelsCompleted={allLevelsCompleted}
      />
      <div className='flex flex-col items-center justify-center bg-white p-3' />
    </div>
  )
}
