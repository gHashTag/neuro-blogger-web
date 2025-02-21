import { cn } from '@/lib/utils'
import type React from 'react'
import ChildrenContainer from './ChildrenContainer'

type OverlayContainerProps = {
  onClick?: () => void
  children: React.ReactNode
}

const OverlayContainer: React.FC<OverlayContainerProps> = ({
  children,
  onClick,
}) => (
  <div
    className={cn(
      'bg-rgbColors-1 absolute inset-0 z-50 grid h-screen w-full place-items-center'
    )}
    role='presentation'
    onClick={onClick}
  >
    <ChildrenContainer>{children}</ChildrenContainer>
  </div>
)
export default OverlayContainer
