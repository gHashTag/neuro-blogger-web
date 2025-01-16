import { useMotionValue } from 'framer-motion'
import React, { useState, useEffect, useCallback } from 'react'
import { useMotionTemplate, motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useCopyToClipboard } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'

import { Passport } from '@/types'
import { captureExceptionSentry } from '@/utils/sentry'
import { SITE_URL } from '@/utils/constants'

type EvervaultCardProps = {
  text: string
  type: string
  className?: string
  inviteToMeet: (type: string) => void
  inviteHostCode: string
  inviteMemberCode: string
  inviteGuestCode: string
  onOpenModalPassport: () => void
  passportData: Passport[]
}

export const EvervaultCard = ({
  text,
  type,
  className,
  inviteToMeet,
  inviteHostCode,
  inviteMemberCode,
  inviteGuestCode,
  onOpenModalPassport,
  passportData,
}: EvervaultCardProps) => {
  const router = useRouter()
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  const [copiedText, copy] = useCopyToClipboard()
  const [randomString, setRandomString] = useState('')
  const { toast } = useToast()
  const { username, user_id, workspace_id, room_id } = useUser()

  useEffect(() => {
    let str = generateRandomString(1500)
    setRandomString(str)
  }, [])

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)

    const str = generateRandomString(1500)
    setRandomString(str)
  }

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        toast({
          title: 'Copied!',
          description: `${text} copied`,
        })
      })
      .catch(error => {
        captureExceptionSentry('handleCopy', 'EvervaultCard')
        toast({
          title: 'Error',
          variant: 'destructive',
          description: `${error}`,
        })
      })
  }

  const handleClick = useCallback(async () => {
    if (
      router.pathname !==
      `/${username}/${user_id}/${workspace_id}/${room_id}/meet/${inviteHostCode}`
    ) {
      if (type === 'guest') {
        handleCopy(
          `${SITE_URL}/${username}/${user_id}/${workspace_id}/${room_id}/meet/${inviteMemberCode}`
        )
        inviteToMeet(type)
      } else if (type === 'member') {
        inviteToMeet(type)
        onOpenModalPassport()
      } else if (type === 'host') {
        inviteToMeet(type)
      }
    }
  }, [
    inviteGuestCode,
    inviteHostCode,
    inviteMemberCode,
    inviteToMeet,
    onOpenModalPassport,
    passportData,
    room_id,
    type,
    user_id,
    workspace_id,
  ])

  const href =
    type === 'host'
      ? `/${username}/${user_id}/${workspace_id}/${room_id}/meet/${inviteHostCode}`
      : router.asPath

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className='container relative mx-auto flex h-[13rem] max-w-sm cursor-pointer flex-col items-start border border-black/[0.2] p-4 px-4 dark:border-yellow-500/[0.2] md:px-6 lg:px-8'
      >
        <Icon className='absolute -left-3 -top-3 h-6 w-6 text-black dark:text-yellow-500' />
        <Icon className='absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-yellow-500' />
        <Icon className='absolute -right-3 -top-3 h-6 w-6 text-black dark:text-yellow-500' />
        <Icon className='absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-yellow-500' />
        <div
          style={{ width: 320, height: 170 }}
          className={cn(
            'relative flex aspect-square h-full w-full items-center justify-center bg-transparent p-0.5',
            className
          )}
        >
          <div
            onMouseMove={onMouseMove}
            className='group/card relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-transparent'
          >
            <CardPattern
              mouseX={mouseX}
              mouseY={mouseY}
              randomString={randomString}
            />
            <div className='relative z-10 flex items-center justify-center'>
              <div className='relative flex h-44 w-44 items-center justify-center rounded-full text-4xl font-bold text-white'>
                <div className='absolute h-full w-full rounded-full bg-white/[0.8] blur-sm dark:bg-black/[0.8]' />
                <span className='z-20 text-center text-black dark:text-white'>
                  {text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export function CardPattern({ mouseX, mouseY, randomString, onClick }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`
  let style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className='cursor-pointer' onClick={onClick}>
      <div className='absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50'></div>
      <motion.div
        className='to-white-700 absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500 opacity-0 backdrop-blur-xl transition duration-500 group-hover/card:opacity-100'
        style={style}
      />
      <motion.div
        className='absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover/card:opacity-100'
        style={style}
      >
        <p className='absolute inset-x-0 h-full whitespace-pre-wrap break-words font-mono text-xs font-bold text-white transition duration-500'>
          {randomString}
        </p>
      </motion.div>
    </div>
  )
}

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateRandomString = (length: number) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className={className}
      {...rest}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
    </svg>
  )
}
