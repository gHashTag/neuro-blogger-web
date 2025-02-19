import React, { useRef, useEffect } from 'react'

type VideoDisplayProps = {
  isVideoOn: boolean
  shareStream: MediaStream | null
  videoRef: React.RefObject<HTMLVideoElement>
  screenRef: React.RefObject<HTMLVideoElement>
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  isVideoOn,
  shareStream,
  videoRef,
  screenRef,
}) => {
  return (
    <div className='relative flex h-full w-full'>
      <div className='relative flex h-full w-full gap-4'>
        {isVideoOn && (
          <div className='flex-1 rounded-xl border-2 border-blue-400'>
            <video
              ref={videoRef}
              className='h-full w-full rounded-xl object-cover'
              autoPlay
              muted
            />
          </div>
        )}
        {shareStream && (
          <div className='flex-1 rounded-xl border-2 border-blue-400'>
            <video
              ref={screenRef}
              className='h-full w-full rounded-xl object-cover'
              autoPlay
              muted
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoDisplay
