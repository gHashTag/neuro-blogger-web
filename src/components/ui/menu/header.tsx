'use-client'

import React, { useState, useEffect } from 'react'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@heroui/react'
import IconLogo from './icon-logo'
import { usePathname } from 'next/navigation'
import DropdownMenuApp from './dropdown'
import useDeviceDetect from '@/hooks/useDeviceDetect'

import { useUser } from '@/hooks/useUser'

// import { getPublicCompressed } from '@toruslabs/eccrypto'

export default function Header() {
  const { isMobile } = useDeviceDetect()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const pathname = usePathname()
  const { username } = useUser()

  const isTabActive = (path: string) => {
    return pathname === path
  }

  const handleLogoClick = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  return (
    <Navbar shouldHideOnScroll>
      {!isMobile && (
        <IconLogo
          width='40'
          height='40'
          backgroundColor='var(--brand)'
          foregroundColor='black'
        />
      )}
      {isMobile && (
        <NavbarBrand>
          <div onClick={handleLogoClick}>
            <DropdownMenuApp />
          </div>
        </NavbarBrand>
      )}
      <div style={{ padding: '20px' }} />
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarItem isActive={isTabActive('/meets')}>
          <Link
            color={isTabActive('/meets') ? 'primary' : 'foreground'}
            href='/meets'
          >
            Meets
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isTabActive('/tasks')}>
          <Link
            color={isTabActive('/tasks') ? 'primary' : 'foreground'}
            href='/tasks'
          >
            Tasks
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isTabActive('/wallet')}>
          <Link
            color={isTabActive('/wallet') ? 'primary' : 'foreground'}
            href={`/${username}`}
          >
            Wallet
          </Link>
        </NavbarItem>
      </NavbarContent>
      {/* <NavbarContent justify="end">
        {!loggedIn && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link onClick={login}>Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" onClick={login} variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent> */}
    </Navbar>
  )
}
