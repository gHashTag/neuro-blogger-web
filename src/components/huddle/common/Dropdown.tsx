import type React from 'react'

// Radix ui
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

type DropdownProps = {
  align?: 'center' | 'start' | 'end'
  open?: boolean
  onOpenChange?(open: boolean): void
  triggerChild: JSX.Element
  children: React.ReactNode
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  triggerChild,
  onOpenChange,
  open,
  align,
}) => {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <span className='cursor-pointer'>{triggerChild}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        align={align}
        className='bg-custom-3 border-custom-4 relative z-10 rounded-xl border p-3'
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
export default Dropdown
