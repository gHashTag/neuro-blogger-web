import React from 'react'

import { cn } from '@/lib/utils'
import Header from './Header/Header'
import ViewComponent from './ViewController'
import { BasicIcons } from '@/components/assets/BasicIcons'
import { useReactiveVar } from '@apollo/client'
import { setSidebarViewVar } from '@/store/reactive-store'

type SidebarProps = {}

const Sidebar: React.FC<SidebarProps> = () => {
  const isSidebarOpen = useReactiveVar(setSidebarViewVar)

  const sidebarView = useReactiveVar(setSidebarViewVar)
  const setSidebarView = useReactiveVar(setSidebarViewVar)

  if (sidebarView === 'close') return null
  const currentView = ViewComponent[sidebarView]
  console.log('currentView', currentView)
  return (
    <aside
      className={cn(
        'bg-custom-3 my-16 mr-1 h-[40rem] max-h-[80vh] w-1/4 flex-col rounded-md transition-all duration-300 ease-out',
        isSidebarOpen ? 'flex' : 'hidden'
      )}
    >
      <Header
        title='Peers'
        icon={BasicIcons.peers}
        onClose={() => {
          setSidebarViewVar('close')
        }}
      />

      <div className='noScrollbar overflow-y-auto px-6 py-4'>
        {currentView && ViewComponent[sidebarView].component}
      </div>
    </aside>
  )
}
export default React.memo(Sidebar)
