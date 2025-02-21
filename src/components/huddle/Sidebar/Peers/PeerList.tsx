import React from 'react'

// Utils
import { cn } from '@/lib/utils'

// Assets
import { PeerListIcons } from '@/components/assets/PeerListIcons'

type PeerListProps = {
  count?: number | string
  className?: string
  title: string
  children: React.ReactNode
}

const PeerList: React.FC<PeerListProps> = ({
  className,
  children,
  title,
  count,
}) => {
  return (
    <div className={cn(className)}>
      <div className='flex h-full items-center gap-4 overflow-y-auto'>
        <div className='h-[1px] flex-1 translate-y-2 bg-slate-800' />
        <div className='relative mt-4 flex items-center justify-center gap-1 text-xs font-medium text-slate-300'>
          {title}
          <span>- {count}</span>
          <span>{PeerListIcons.info}</span>
        </div>
        <div className='h-[1px] flex-1 translate-y-2 bg-slate-800' />
      </div>
      {children}
    </div>
  )
}
export default React.memo(PeerList)
