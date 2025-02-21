import {
  NestedPeerListIcons,
  PeerListIcons,
} from '@/components/assets/PeerListIcons'
import Dropdown from '@/components/huddle/common/Dropdown'
import { cn, getFallbackAvatar } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import HostData from '../PeerRole/HostData'
import CoHostData from '../PeerRole/CoHostData'
import SpeakerData from '../PeerRole/SpeakerData'
import ListenersData from '../PeerRole/ListenersData'
import {
  useDataMessage,
  useRemoteAudio,
  useRemotePeer,
} from '@huddle01/react/hooks'
import { Role } from '@huddle01/server-sdk/auth'
import { useReactiveVar } from '@apollo/client'
import { setRequestedPeersVar } from '@/store/reactive-store'

interface PeerMetaDatProps {
  isRequested?: boolean
  className?: string
  peerId: string
}

const PeerMetaData: React.FC<PeerMetaDatProps> = ({
  className,
  isRequested,
  peerId,
}) => {
  const requestedPeers = useReactiveVar(setRequestedPeersVar)

  const RoleData = {
    host: <HostData peerId={peerId} />,
    coHost: <CoHostData peerId={peerId} />,
    speaker: <SpeakerData peerId={peerId} />,
    listener: <ListenersData peerId={peerId} />,
  } as const

  const { role, metadata, updateRole } = useRemotePeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>({ peerId })

  const { isAudioOn } = useRemoteAudio({ peerId })

  const removeRequestedPeers = (val: string) => {
    setRequestedPeersVar(requestedPeers.filter(peer => peer !== val))
  }

  return (
    <div className={cn(className, 'flex w-full items-center justify-between')}>
      <div className='flex items-center gap-2'>
        <Image
          src={metadata?.avatarUrl ?? getFallbackAvatar()}
          alt='default'
          width={30}
          height={30}
          priority
          quality={100}
          className='rounded-full object-contain'
        />
        <div className='tex-sm font-normal text-slate-400'>
          {metadata?.displayName}
        </div>
      </div>
      {isRequested ? (
        <AcceptDenyGroup
          onDeny={() => {
            if (peerId) {
              removeRequestedPeers(peerId)
            }
          }}
          onAccept={() => {
            if (peerId && role && ['host', 'coHost'].includes(role)) {
              updateRole(Role.SPEAKER)
              removeRequestedPeers(peerId)
            }
          }}
        />
      ) : (
        <div className='flex items-center gap-3'>
          <button onClick={() => {}}>
            {metadata?.isHandRaised
              ? NestedPeerListIcons.active.hand
              : NestedPeerListIcons.inactive.hand}
          </button>
          <button>
            {isAudioOn
              ? NestedPeerListIcons.active.mic
              : NestedPeerListIcons.inactive.mic}
          </button>
          <Dropdown
            triggerChild={<div>{NestedPeerListIcons.inactive.more}</div>}
            align='end'
          >
            {role && RoleData[role as keyof typeof RoleData]}
          </Dropdown>{' '}
        </div>
      )}
    </div>
  )
}

export default React.memo(PeerMetaData)

interface IAcceptDenyProps {
  onAccept?: () => void
  onDeny?: () => void
}

const AcceptDenyGroup: React.FC<IAcceptDenyProps> = ({ onAccept, onDeny }) => (
  <div className='flex items-center gap-4'>
    <div role='presentation' onClick={onAccept}>
      {PeerListIcons.accept}
    </div>
    <div role='presentation' onClick={onDeny}>
      {PeerListIcons.deny}
    </div>
  </div>
)
