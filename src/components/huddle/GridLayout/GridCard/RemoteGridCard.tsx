import React, { useEffect, useState } from 'react'

import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
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
      <AnimatedTooltip
        items={[
          {
            id: 1,
            name: `${metadata?.displayName}`,
            designation: role || '',
            image: metadata?.avatarUrl || getFallbackAvatar(),
          },
        ]}
      />
      <div className='absolute -right-8 -top-1 flex size-8 items-center justify-center text-4xl'>
        {reaction}
      </div>
      {role && ['host, coHost, speaker'].includes(role) && (
        <div className='absolute right-0'>{BasicIcons.audio}</div>
      )}
      {metadata?.isHandRaised && (
        <div className='absolute -left-3 -top-1 flex size-8 items-center justify-center text-4xl'>
          ✋
        </div>
      )}
    </div>
  )
}
export default React.memo(GridCard)
