import { useLocalPeer, usePeerIds } from '@huddle01/react/hooks'
import { Role } from '@huddle01/server-sdk/auth'
import { memo } from 'react'
import LocalGridCard from '../GridCard/LocalGridCard'
import RemoteGridCard from '../GridCard/RemoteGridCard'

const Hosts = () => {
  const { peerIds } = usePeerIds({ roles: [Role.HOST] })
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer()
  console.log('localPeerRole', localPeerRole)
  console.log('peerIds', peerIds)
  return (
    <>
      {localPeerRole === Role.HOST && localPeerId && (
        <LocalGridCard key={`grid-${localPeerId}`} />
      )}
      {peerIds.map(peerId => {
        return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />
      })}
    </>
  )
}

export default memo(Hosts)
