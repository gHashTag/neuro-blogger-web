import React, { type FC, useState } from 'react'
import Image from 'next/image'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
// Assets
import { BasicIcons } from '@/components/assets/BasicIcons'
import {
  useDataMessage,
  useLocalPeer,
  useActivePeers,
} from '@huddle01/react/hooks'
import { getFallbackAvatar } from '@/lib/utils'
import RippleAnimation from './RippleAnimation'

const LocalGridCard: FC = () => {
  const [reaction, setReaction] = useState('')
  const { activePeerIds, dominantSpeakerId } = useActivePeers()
  console.log('activePeerIds', activePeerIds)
  console.log('dominantSpeakerId', dominantSpeakerId)
  const {
    metadata,
    peerId: localPeerId,
    role,
  } = useLocalPeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>()
  console.log('metadata', metadata)

  useDataMessage({
    onMessage(payload, from, label) {
      if (from === localPeerId) {
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
      {dominantSpeakerId === localPeerId && (
        <RippleAnimation isVisible={true} />
      )}

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
export default React.memo(LocalGridCard)
