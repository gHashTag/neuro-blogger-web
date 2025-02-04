import React, { useState } from 'react'

interface InfoOverlayProps {
  title: string
  link: string
  is_ru: boolean
  allLevelsCompleted: boolean
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({
  title,
  link,
  is_ru,
  allLevelsCompleted,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
  }

  return (
    <div
      className='absolute inset-0 flex items-center justify-center p-12'
      style={{ top: '10%', transform: 'scale(0.9)' }}
    >
      <div className='rounded-lg bg-white bg-opacity-5 p-2 text-center shadow-lg backdrop-blur-md'>
        <p className='text-sm text-gray-100'>
          {is_ru && !allLevelsCompleted
            ? 'открой нейрокоманду'
            : !allLevelsCompleted && 'open neurocommand'}
        </p>
        <h3 className='text-lg font-bold text-white'>{title}</h3>
        <p className='text-sm text-gray-100'>
          {is_ru ? 'пригласи друга' : 'invite a friend'}
        </p>
        <div className='mt-2 flex items-center justify-center'>
          <button
            onClick={handleCopy}
            className={`flex items-center rounded-full bg-gray-800 bg-opacity-50 px-4 py-2 text-xs text-white transition ${
              copied ? 'animate-pulse' : ''
            }`}
          >
            {link}
            <span className='ml-2'>{copied ? '✔️' : '📋'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoOverlay
