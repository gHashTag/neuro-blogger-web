import { BasicIcons } from '@/components/assets/BasicIcons'
import { useReactiveVar } from '@apollo/client'
import React from 'react'
import ViewComponent from '../ViewController'
import { setSidebarViewVar } from '@/store/reactive-store'

type HeaderProps = {
  title?: string
  icon?: React.ReactNode
  onClose?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, icon, onClose }) => {
  const sidebarView = useReactiveVar(setSidebarViewVar)

  const setSidebarView = (val: string) => {
    setSidebarViewVar(val)
  }

  return (
    <div className='flex w-full items-start justify-between border-b border-slate-800 px-6 py-3'>
      <div className='flex items-center gap-4'>
        <div>{icon}</div>
        <div className='font-inter text-base text-slate-300'>{title}</div>
      </div>

      <button type='button' onClick={() => setSidebarView('close')}>
        {BasicIcons.close}
      </button>
    </div>
  )
}
export default React.memo(Header)
