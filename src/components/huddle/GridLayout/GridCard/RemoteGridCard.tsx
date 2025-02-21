import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// Assets
import { BasicIcons } from '@/components/assets/BasicIcons'
import {
  useDataMessage,
  useRemoteAudio,
  useRemotePeer,
} from '@huddle01/react/hooks'
import AudioElem from '@/components/huddle/common/AudioElem'
import { getFallbackAvatar } from '@/lib/utils'

type GridCardProps = {
  peerId: string
}

const GridCard: React.FC<GridCardProps> = ({ peerId }) => {
  const [reaction, setReaction] = useState('')

  const { metadata, role } = useRemotePeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>({ peerId })

  const { stream, isAudioOn } = useRemoteAudio({
    peerId,
    onPlayable: () => {
      console.debug('ON PLAYABLE')
    },
  })

  useDataMessage({
    onMessage(payload, from, label) {
      if (from === peerId) {
        if (label === 'reaction') {
          setReaction(payload)
          setTimeout(() => {
            setReaction('')
          }, 5000)
        }
      }
    },
  })

  return (
    <div className='relative flex flex-col items-center justify-center'>
      {stream && <AudioElem peerId={peerId} />}
      <Image
        src={metadata?.avatarUrl || getFallbackAvatar()}
        alt='default-avatar'
        width={100}
        height={100}
        quality={100}
        priority
        className='maskAvatar'
      />

      <div className='mt-1 text-center'>
        <div className='text-custom-5 text-base font-medium'>
          {metadata?.displayName}
        </div>
        <div className='text-custom-6 text-sm font-normal'>{role}</div>
      </div>
      <div className='absolute bottom-1/2 left-1/2 mb-2 -translate-x-1/2 text-4xl'>
        {reaction}
      </div>
      {role && ['host, coHost, speaker'].includes(role) && (
        <div className='absolute right-0'>{BasicIcons.audio}</div>
      )}
      {metadata?.isHandRaised && (
        <div className='bg-custom-8 border-custom-1 absolute -top-1 right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xl'>
          ✋
        </div>
      )}
    </div>
  )
}
export default React.memo(GridCard)
