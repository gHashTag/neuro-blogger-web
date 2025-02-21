import Image from 'next/image'
import { usePeerIds, useRemotePeer } from '@huddle01/react/hooks'
import { Role } from '@huddle01/server-sdk/auth'
import { getFallbackAvatar } from '@/lib/utils'
import { useReactiveVar } from '@apollo/client'
import {
  setShowAcceptRequestVar,
  setRequestedPeersVar,
} from '@/store/reactive-store'

type AcceptRequestProps = {
  peerId: string
}

const AcceptRequest: React.FC<AcceptRequestProps> = ({ peerId }) => {
  const { metadata, updateRole } = useRemotePeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>({ peerId })

  const requestedPeers = useReactiveVar(setRequestedPeersVar)

  const setShowAcceptRequest = (val: boolean) => {
    setShowAcceptRequestVar(val)
  }

  const removeRequestedPeers = (val: string) => {
    setRequestedPeersVar(requestedPeers.filter(peer => peer !== val))
  }

  return (
    <div className='bg-custom-2 inline-flex flex-col items-center justify-center rounded-lg p-4'>
      <div className='flex flex-col items-start justify-center gap-2'>
        <Image
          src={metadata?.avatarUrl ?? getFallbackAvatar()}
          alt='avatar'
          width={50}
          height={50}
          className='rounded-full'
        />
        <div className='font-inter text-sm font-semibold text-slate-100'>
          {metadata?.displayName} requested to be a speaker
        </div>
        <div className='font-inter text-xs text-slate-100'>
          You can view all the requests in the sidebar
        </div>
        <div className='flex items-start gap-2'>
          <button
            className='bg-custom-8 flex w-20 items-center justify-center rounded-lg px-1 py-2 text-sm font-medium'
            onClick={() => {
              updateRole(Role.SPEAKER)
              setShowAcceptRequest(false)
              removeRequestedPeers(peerId)
            }}
          >
            Accept
          </button>
          <button
            className='flex w-20 items-center justify-center rounded-lg border border-red-400 px-1 py-2 text-sm font-medium text-red-400'
            onClick={() => {
              setShowAcceptRequest(false)
              removeRequestedPeers(peerId)
            }}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  )
}

export default AcceptRequest
