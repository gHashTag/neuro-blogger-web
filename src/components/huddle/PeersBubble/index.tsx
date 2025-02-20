import RemotePeer from '../RemotePeer'

export default function PeersBubble({ peerIds }: { peerIds: string[] }) {
  return (
    <div className='grid gap-2 text-center lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left'>
      {peerIds.map(peerId =>
        peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
      )}
    </div>
  )
}
