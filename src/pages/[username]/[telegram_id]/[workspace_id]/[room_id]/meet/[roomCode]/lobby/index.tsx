'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useReactiveVar } from '@apollo/client'
import { setAvatarUrlVar, setUserDisplayNameVar } from '@/store/reactive-store'
import { GetServerSidePropsContext } from 'next'
import { createToken } from '@/helpers/huddle01'
import { Role } from '@huddle01/server-sdk/auth'
import { SITE_URL } from '@/config'
import { useUser } from '@/hooks/useUser'
import { useRoom } from '@huddle01/react/hooks'
import Layout from '@/components/layout'
// Assets
import { toast } from 'react-hot-toast'
import { BasicIcons } from '@/components/assets/BasicIcons'

// Components
import FeatCommon from '@/components/huddle/common/FeatCommon'
import AvatarWrapper from '@/components/huddle/common/AvatarWrapper'

type TLobboyProps = {
  roomId: string
  token: string
  workspace_id: string
  roomCode: string
  room_name: string
  username: string
  telegram_id: string
}

const Lobby = ({
  roomId,
  token,
  workspace_id,
  roomCode,
  room_name,
  username,
  telegram_id,
}: TLobboyProps) => {
  const avatarUrl = useReactiveVar(setAvatarUrlVar)
  console.log('avatarUrl', avatarUrl)
  const { username: firstName, lastName } = useUser()

  const roomUrl = `${SITE_URL}/${username}/${telegram_id}/${workspace_id}/${room_name}/meet/${roomCode}`
  // Local States
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const userDisplayName = useReactiveVar(setUserDisplayNameVar)

  const [isJoining, setIsJoining] = useState<boolean>(false)
  const { push } = useRouter()

  // Huddle Hooks
  const { joinRoom, state } = useRoom()

  useEffect(() => {
    if (!avatarUrl) {
      const defaultAvatarUrl = '/avatars/avatars/1.jpg'
      setAvatarUrlVar(defaultAvatarUrl)
    }
    if (firstName && lastName) {
      const fullName = `${firstName} ${lastName}`
      setUserDisplayNameVar(fullName)
    }
    if (state === 'connected') {
      push(roomUrl)
    }
  }, [avatarUrl, firstName, lastName, state, roomUrl, push])

  const handleStartSpaces = async () => {
    setIsJoining(true)
    if (!userDisplayName.length) {
      toast.error('Display name is required!')
      setIsJoining(false)
      return
    }

    try {
      await joinRoom({
        roomId,
        token,
      })
      push(roomUrl)
    } catch (error) {
      console.error('Error during joinRoom:', error)
      toast.error('An error occurred while joining the room.')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Layout loading={isJoining}>
      <div className='flex h-[80vh] items-center justify-center'>
        <div className='flex w-[26.25rem] flex-col items-center justify-center gap-4'>
          <div className='relative mx-auto flex w-fit items-center justify-center text-center'>
            {avatarUrl && (
              <>
                <Image
                  src={avatarUrl}
                  alt='audio-spaces-img'
                  width={125}
                  height={125}
                  className='maskAvatar rounded-full object-contain' // Добавлен класс rounded-full
                  quality={100}
                  priority
                />
                <video
                  src={avatarUrl}
                  muted
                  className='maskAvatar absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2'
                  // autoPlay
                  loop
                />
              </>
            )}
            <button
              onClick={() => setIsOpen(prev => !prev)}
              type='button'
              className='absolute bottom-0 right-0 z-10 text-white'
            >
              {BasicIcons.edit}
            </button>
            <FeatCommon
              onClose={() => setIsOpen(false)}
              className={
                isOpen
                  ? 'absolute top-4 block'
                  : 'absolute top-1/2 hidden -translate-y-1/2'
              }
            >
              <div className='relative mt-5'>
                <div className='grid h-full w-full grid-cols-3 place-items-center gap-6 px-6'>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const url = `/avatars/avatars/${i}.jpg`

                    return (
                      <AvatarWrapper
                        key={`sidebar-avatars-${i}`}
                        isActive={avatarUrl === url}
                        onClick={() => {
                          console.log('url', url)
                          setAvatarUrlVar(url)
                          setIsOpen(false)
                        }}
                      >
                        <Image
                          src={url}
                          alt={`avatar-${i}`}
                          width={45}
                          height={45}
                          loading='lazy'
                          className='object-contain'
                        />
                      </AvatarWrapper>
                    )
                  })}
                </div>
              </div>
            </FeatCommon>
          </div>
          <div className='flex w-full flex-col items-center'>
            <div className='flex w-full flex-col justify-center gap-1'>
              Set a display name
              <div className='gap- flex w-full items-center rounded-[10px] border border-zinc-800 px-3 text-slate-300 outline-none backdrop-blur-[400px] focus-within:border-slate-600'>
                <div className='mr-2'>
                  <Image
                    alt='user-icon'
                    src='/images/user-icon.svg'
                    className='h-5 w-5'
                    width={30}
                    height={30}
                  />
                </div>
                <input
                  value={userDisplayName}
                  onChange={e => {
                    setUserDisplayNameVar(e.target.value)
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleStartSpaces()}
                  type='text'
                  placeholder='Enter your name'
                  className='flex-1 bg-transparent py-3 outline-none'
                />
              </div>
            </div>
          </div>
          <div className='flex w-full items-center'>
            <button
              className='mt-2 flex w-full items-center justify-center rounded-md bg-[#246BFD] p-2 text-slate-100'
              onClick={handleStartSpaces}
            >
              {isJoining ? 'Joining Spaces...' : 'Start Spaces'}
              {!isJoining && (
                <Image
                  alt='narrow-right'
                  width={30}
                  height={30}
                  src='/images/arrow-narrow-right.svg'
                  className='ml-1 h-6 w-6'
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Lobby

type TRoomsProps = {
  roomId: string
  token: string
  workspace_id: string
  roomCode: string
  room_name: string
  username: string
  telegram_id: string
}

const defaultProps = {
  token: '',
  roomId: '',
  username: '',
  workspace_id: '',
  roomCode: '',
  room_name: '',
  telegram_id: '',
}
export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  props: TRoomsProps
}> => {
  console.log('ctx.query', ctx.query)
  try {
    const roomId = ctx.query.roomCode as string
    const username = ctx.query.username as string
    const workspace_id = ctx.query.workspace_id as string
    const roomCode = ctx.query.roomCode as string
    const room_name = ctx.query.room_id as string
    const telegram_id = ctx.query.telegram_id as string

    const apiKey = process.env.HUDDLE01_API_KEY!
    if (!apiKey || !roomId) {
      return {
        props: defaultProps,
      }
    }
    const token = await createToken(roomId, Role.HOST, 'Host', true)

    return {
      props: {
        token,
        roomId,
        username,
        workspace_id,
        roomCode,
        room_name,
        telegram_id,
      },
    }
  } catch (error) {
    console.error('Error in getServerSideProps', error)
    return {
      props: defaultProps,
    }
  }
}
