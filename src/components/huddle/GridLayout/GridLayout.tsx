import { useLocalPeer, usePeerIds } from '@huddle01/react/hooks'
import { Role } from '@huddle01/server-sdk/auth'
import CoHosts from './ViewPorts/CoHosts'
import Hosts from './ViewPorts/Hosts'
import Speakers from './ViewPorts/Speakers'
import Listeners from './ViewPorts/Listeners'

type GridLayoutProps = {}

const GridLayout: React.FC<GridLayoutProps> = () => {
  const { peerIds } = usePeerIds({ roles: [Role.LISTENER] })
  const { role: localPeerRole } = useLocalPeer()

  return (
    <div className='ml-10 flex size-full flex-col items-center justify-center py-20'>
      <div className='flex w-full flex-wrap items-center justify-center gap-4'>
        <Hosts />
        <CoHosts />
        <Speakers />
      </div>
      <div className='mt-10'>
        {/* <div className='mb-5 text-center text-base font-normal'>
          Listeners -{' '}
          {peerIds.length +
            (localPeerRole && localPeerRole === Role.LISTENER ? 1 : 0)}
        </div> */}
        <div className='flex w-full flex-wrap items-center justify-center gap-4'>
          <Listeners />
        </div>
      </div>
    </div>
  )
}
export default GridLayout
