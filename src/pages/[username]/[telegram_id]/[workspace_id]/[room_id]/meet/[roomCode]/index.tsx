'use client'
import RemotePeer from '@/components/huddle/RemotePeer'
import { TPeerMetadata } from '@/interfaces/huddle01.interface'
import { GetServerSidePropsContext } from 'next'
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from '@huddle01/react/hooks'
import { AccessToken, Role } from '@huddle01/server-sdk/auth'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import ConnectedView from '@/components/huddle/ConnectedView'
import Layout from '@/components/layout'
import { getUserByTelegramId } from '@/core/supabase'
const inter = Inter({ subsets: ['latin'] })

type Props = {
  token: string
  roomId: string
  username: string
}

export default function Rooms({ token, roomId, username }: Props) {
  console.log('roomId 2', roomId)
  const [displayName, setDisplayName] = useState<string>('')

  const router = useRouter()
  const { firstName, lastName } = useUser()
  const { updateMetadata } = useLocalPeer<TPeerMetadata>()

  const { joinRoom, room, state } = useRoom({
    onJoin: room => {
      console.log('onJoin', room)
      if (firstName && lastName) {
        updateMetadata({
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          username,
        })
      }
    },
    onPeerJoin: peer => {
      console.log('onPeerJoin', peer)
    },
  })
  console.log('state', state)
  console.log('room', room)
  console.log('sessionId', room?.sessionId)

  useEffect(() => {
    console.log('firstName', firstName)
    console.log('lastName', lastName)
    if (firstName && lastName) {
      const fullName = `${firstName} ${lastName}`
      setDisplayName(fullName)
      joinRoom({
        roomId,
        token,
      })
      updateMetadata({ firstName, lastName, displayName: fullName, username })
    }
  }, [firstName, lastName, joinRoom, roomId, token, username, updateMetadata])

  return (
    <Layout loading={state === 'idle'}>
      {/* <p className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          <code className='font-mono font-bold'>{state}</code>
        </p> */}

      {state === 'idle' && (
        <>
          <input
            disabled={state !== 'idle'}
            placeholder='Display Name'
            type='text'
            className='mx-2 rounded-lg border-2 border-blue-400 bg-black p-2 text-white'
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
          />

          <button
            disabled={!displayName}
            type='button'
            className='mx-2 rounded-lg bg-blue-500 p-2'
            onClick={async () => {
              await joinRoom({
                roomId,
                token,
              })
            }}
          >
            Join Room
          </button>
        </>
      )}

      {state === 'connected' && <ConnectedView roomId={roomId} />}

      {/* <div className='mt-8 flex w-full items-stretch justify-between gap-4'>
        <div className='flex flex-1 flex-col items-center justify-between'>
          <div className="before:bg-gradient-radial after:bg-gradient-conic relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
            <div className='relative flex gap-2'>
              {isVideoOn && (
                <div className='mx-auto w-1/2 rounded-xl border-2 border-blue-400'>
                  <video
                    ref={videoRef}
                    className='aspect-video rounded-xl'
                    autoPlay
                    muted
                  />
                </div>
              )}
              {shareStream && (
                <div className='mx-auto w-1/2 rounded-xl border-2 border-blue-400'>
                  <video
                    ref={screenRef}
                    className='aspect-video rounded-xl'
                    autoPlay
                    muted
                  />
                </div>
              )}
            </div>
          </div>

          <div className='mb-32 mt-8 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left'>
            {peerIds.map(peerId =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>
      </div> */}
    </Layout>
  )
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  props: {
    token: string | null
    roomId: string | null
    username: string | null
  }
}> => {
  try {
    console.log('ctx.query', ctx.query)
    const roomId = ctx.query.roomCode as string
    console.log('roomId 1', roomId)
    const username = ctx.query.username as string

    const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
    if (!apiKey || !roomId) {
      return {
        props: { token: null, roomId: null, username: null },
      }
    }

    const accessToken = new AccessToken({
      apiKey,
      roomId,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
    })

    let token = await accessToken.toJwt()

    if (!token) {
      console.error('Failed to generate token')
      token = ''
    }

    return {
      props: { token, roomId, username },
    }
  } catch (error) {
    console.error('Error in getServerSideProps', error)
    return {
      props: { token: null, roomId: null, username: null },
    }
  }
}
