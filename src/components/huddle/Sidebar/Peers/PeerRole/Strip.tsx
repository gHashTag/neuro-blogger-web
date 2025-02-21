import { PeerListIcons } from '@/components/assets/PeerListIcons'
import { cn } from '@/lib/utils'
import React from 'react'

type StripProps = {
  type: string
  title: string
  className?: string
  variant: 'normal' | 'danger'
  onClick?: () => void
}

const Strip: React.FC<StripProps> = ({ type, title, variant, onClick }) => {
  return (
    <div
      className={cn(
        'mb-1 flex cursor-pointer items-center gap-3 rounded-md p-1 text-sm font-normal transition-all duration-300 ease-in-out last:mb-0',
        variant === 'normal'
          ? 'text-rgbColors-3 hover:bg-rgbColors-3/10'
          : 'hover:bg-rgbColors-4 text-red-400'
      )}
      onClick={onClick}
    >
      <div className='flex h-6 w-6 items-center justify-center'>
        {PeerListIcons[type]}
      </div>
      <div>{title}</div>
    </div>
  )
}
export default React.memo(Strip)
