import { BasicIcons } from '@/components/assets/BasicIcons'
import Peers from '@/components/huddle/Sidebar/Peers/Peers'
import Chat from '@/components/huddle/Chat'

export type TViewComponent = {
  [key: string]: {
    icon: JSX.Element
    headerData: string
    component: JSX.Element
  }
}

const ViewComponent: TViewComponent = {
  peers: {
    icon: BasicIcons.peers,
    headerData: 'Peers',
    component: <Peers />,
  },
  chat: {
    icon: BasicIcons.peers,
    headerData: 'Chat',
    component: <Chat />,
  },
}

export default ViewComponent
