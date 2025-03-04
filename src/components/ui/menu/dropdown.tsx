'use-client'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'

import MenuLogo from './menu-logo'

import useDeviceDetect from '@hooks/useDeviceDetect'

export default function DropdownMenuApp() {
  const { isMobile, isTablet } = useDeviceDetect()
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='light'>
          <MenuLogo />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        <DropdownItem key='new'>Meetsdd</DropdownItem>
        <DropdownItem key='copy'>Tasks</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
