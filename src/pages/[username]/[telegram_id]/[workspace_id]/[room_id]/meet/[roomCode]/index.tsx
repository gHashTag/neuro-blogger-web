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
  useDataMessage,
  useActivePeers,
} from '@huddle01/react/hooks'
import { useRoomMetadata } from '@huddle01/react'
import { AccessToken, Role } from '@huddle01/server-sdk/auth'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import ConnectedView from '@/components/huddle/ConnectedView'
import Layout from '@/components/layout'
import BottomBar from '@/components/huddle/BottomBar'
import Sidebar from '@/components/huddle/Sidebar/Sidebar'
import GridLayout from '@/components/huddle/GridLayout/GridLayout'
import Prompts from '@/components/huddle/common/Prompts'
import AcceptRequest from '@/components/huddle/Modals/AcceptRequest'
import Chat from '@/components/huddle/Chat'

import { createToken } from '@/helpers/huddle01'
import { SITE_URL } from '@/config'
import { useParams } from 'next/navigation'
import { useReactiveVar } from '@apollo/client'
import {
  setAvatarUrlVar,
  setUserDisplayNameVar,
  setIsChatOpenVar,
  setChatMessagesVar,
  setShowAcceptRequestVar,
  setRequestedPeersVar,
} from '@/store/reactive-store'

type TRoomsProps = {
  roomId: string
  token: string
  workspace_id: string
  roomCode: string
  room_name: string
  username: string
  telegram_id: string
}

export default function Rooms({
  token,
  roomId,
  username,
  workspace_id,
  room_name,
  roomCode,
  telegram_id,
}: TRoomsProps) {
  console.log('roomId 2', roomId)
  const [displayName, setDisplayName] = useState<string>('')
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio()
  const { push } = useRouter()
  const { username: userName, firstName, lastName } = useUser()
  useUser()
  const { activePeerIds, dominantSpeakerId } = useActivePeers()
  console.log('activePeerIds', activePeerIds)
  console.log('dominantSpeakerId', dominantSpeakerId)
  // Use reactive variables
  const [requestedPeerId, setRequestedPeerId] = useState('')
  const avatarUrl = useReactiveVar(setAvatarUrlVar)
  const isChatOpen = useReactiveVar(setIsChatOpenVar)
  const chatMessages = useReactiveVar(setChatMessagesVar)
  const showAcceptRequest = useReactiveVar(setShowAcceptRequestVar)
  const requestedPeers = useReactiveVar(setRequestedPeersVar)

  const lobbyUrl = `${SITE_URL}/${username}/${telegram_id}/${workspace_id}/${room_name}/meet/${roomCode}/lobby`

  const { room, state } = useRoom({
    onJoin: room => {
      console.log('onJoin', room)
    },
    onPeerJoin: peer => {
      console.log('onPeerJoin', peer)
    },
    onLeave: () => {
      push(lobbyUrl)
    },
  })

  const {
    updateMetadata: updateMetadataLocalPeer,
    metadata,
    peerId,
    updateRole,
    role,
  } = useLocalPeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>()

  const { peerIds } = usePeerIds({
    roles: [],
    labels: [],
    onPeerRoleUpdate(data) {},
  })
  console.log('peerIds', peerIds)

  const { roomData, updateMetadata } = useRoomMetadata()
  console.log('useRoomMetadata', roomData)
  console.log('state', state)
  console.log('room', room)
  console.log('sessionId', room?.sessionId)

  useEffect(() => {
    if (state === 'connected' && firstName && lastName) {
      const fullName = `${firstName} ${lastName}`
      setDisplayName(fullName)
      updateMetadata({
        firstName,
        lastName,
        displayName: fullName,
        username,
        avatarUrl: avatarUrl ?? '',
      })
      !userName && updateRole({ role: Role.LISTENER })
    }
  }, [
    state,
    firstName,
    lastName,
    updateMetadata,
    username,
    avatarUrl,
    updateRole,
    userName,
  ])

  useEffect(() => {
    if (state === 'idle') {
      push(lobbyUrl)
      return
    }

    updateMetadataLocalPeer({
      displayName: displayName,
      avatarUrl: avatarUrl ?? '',
      isHandRaised: false,
    })
  }, [
    updateMetadata,
    userName,
    state,
    displayName,
    avatarUrl,
    updateMetadataLocalPeer,
    lobbyUrl,
    push,
  ])

  useDataMessage({
    onMessage(payload, from, label) {
      if (label === 'requestToSpeak') {
        setShowAcceptRequestVar(true)
        setRequestedPeersVar([...requestedPeers, from])
        setTimeout(() => {
          setShowAcceptRequestVar(false)
        }, 5000)
      }

      if (label === 'chat' && from !== peerId) {
        const messagePayload = JSON.parse(payload)
        const newChatMessage = {
          name: messagePayload.name,
          text: messagePayload.message,
          is_user: false,
        }
        setChatMessagesVar([...chatMessages, newChatMessage])
      }
    },
  })

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequestVar(false)
    }
  }, [requestedPeers, requestedPeerId])

  return (
    <Layout loading={false}>
      <section className='relative flex h-[80vh] w-full items-center justify-center text-slate-100'>
        <div className='flex w-full items-center justify-center'>
          <GridLayout />
          <Sidebar />
          <div className='absolute bottom-20 right-4'>
            {showAcceptRequest && <AcceptRequest peerId={requestedPeerId} />}
          </div>
        </div>
        {isChatOpen && <Chat />}
        <BottomBar />
        <Prompts />
      </section>
    </Layout>
  )
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  props: TRoomsProps
}> => {
  try {
    const roomId = ctx.query.roomCode as string
    const username = ctx.query.username as string
    const workspace_id = ctx.query.workspace_id as string
    const roomCode = ctx.query.roomCode as string
    const room_name = ctx.query.room_id as string
    const telegram_id = ctx.query.telegram_id as string

    const apiKey = process.env.NEXT_PUBLIC_HUDDLE01_API_KEY || ''
    if (!apiKey || !roomId) {
      return {
        props: {
          token: '',
          roomId: '',
          username: '',
          workspace_id: '',
          roomCode: '',
          room_name: '',
          telegram_id: '',
        },
      }
    }
    let token = ''

    try {
      const response = await fetch(
        `https://api.huddle01.com/api/v1/live-meeting/preview-peers?roomId=${roomId}`,
        {
          headers: {
            'x-api-key': process.env.HUDDLE01_API_KEY ?? '',
          },
        }
      )
      const data = await response.json()
      const { previewPeers } = data
      console.log('previewPeers', previewPeers)

      token = await createToken(roomId, Role.HOST, 'Host', true)
    } catch (error) {
      token = await createToken(roomId, Role.LISTENER, 'Guest', false)
    }

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
      props: {
        token: '',
        roomId: '',
        username: '',
        workspace_id: '',
        roomCode: '',
        room_name: '',
        telegram_id: '',
      },
    }
  }
}
