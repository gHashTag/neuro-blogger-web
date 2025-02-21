import { PeerListIcons } from '@/components/assets/PeerListIcons'
import { getFallbackAvatar } from '@/lib/utils'
import { useRemotePeer } from '@huddle01/react/hooks'
import { Role } from '@huddle01/server-sdk/auth'
import Image from 'next/image'
import type { FC } from 'react'
import { useReactiveVar } from '@apollo/client'
import { setRequestedPeersVar } from '@/store/reactive-store'

interface AcceptDenyPeerProps {
  peerId: string
}

const AcceptDenyPeer: FC<AcceptDenyPeerProps> = ({ peerId }) => {
  const { metadata, updateRole } = useRemotePeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>({ peerId })

  const requestedPeers = useReactiveVar(setRequestedPeersVar)

  const removeRequestedPeers = (val: string) => {
    setRequestedPeersVar(requestedPeers.filter(peer => peer !== val))
  }

  return (
    <div className='flex w-full items-center justify-between'>
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
      <div className='flex items-center gap-4'>
        <div
          role='presentation'
          onClick={() => {
            updateRole(Role.SPEAKER)
            setRequestedPeersVar(requestedPeers.filter(peer => peer !== peerId))
          }}
        >
          {PeerListIcons.accept}
        </div>
        <div
          role='presentation'
          onClick={() => {
            removeRequestedPeers(peerId)
          }}
        >
          {PeerListIcons.deny}
        </div>
      </div>
    </div>
  )
}

export default AcceptDenyPeer
