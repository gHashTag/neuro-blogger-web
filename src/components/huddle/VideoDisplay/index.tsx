import React, { useRef, useEffect } from 'react'
import { usePeerIds } from '@huddle01/react/hooks'
import RemotePeer from '../RemotePeer'

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
  const { peerIds } = usePeerIds()

  return (
    <div className='relative flex h-full w-full'>
      <div className='relative flex h-full w-full gap-4'>
        <div className='z-0 flex-1'>
          {isVideoOn && (
            <div className='rounded-xl border-2 border-blue-400'>
              <video
                ref={videoRef}
                className='h-full w-full rounded-xl object-cover'
                autoPlay
                muted
              />
            </div>
          )}
          {shareStream && (
            <div className='rounded-xl border-2 border-blue-400'>
              <video
                ref={screenRef}
                className='h-full w-full rounded-xl object-cover'
                autoPlay
                muted
              />
            </div>
          )}
        </div>
        <div className='absolute inset-x-0 bottom-5 z-10 flex items-center justify-center'>
          <div className='grid gap-2 text-center lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left'>
            {peerIds.map(peerId =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoDisplay
