'use client'

import { useState, useEffect, Suspense } from 'react'
import Layout from '@/components/layout'
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
  // @ts-ignore
} from '@100mslive/react-sdk'
import dynamic from 'next/dynamic'
import { usePassport } from '@/hooks/usePassport'
import { useRouter } from 'next/router'

import { useUser } from '@/hooks/useUser'
import { captureExceptionSentry } from '@/utils/sentry'
import Loader from '@/components/loader'

type QueryType = {
  roomCode: string
  username: string
  workspace_id: string
  room_id: string
  telegram_id: string
}
const HMSPrebuilt = dynamic(
  () =>
    import('@100mslive/roomkit-react').then(mod => ({
      default: mod.HMSPrebuilt,
    })),
  {
    ssr: false,
  }
)

const Rooms = () => {
  const router = useRouter()
  const { firstName, lastName } = useUser()
  const { workspace_id, room_id, roomCode, telegram_id } =
    router.query as QueryType
  const [token, setToken] = useState<string | undefined>(undefined)
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const [loading, setLoading] = useState(false)
  const [isPassport, setIsPassport] = useState(false)
  const [userName, setUserName] = useState('')
  const hmsActions = useHMSActions()
  const { passportData, passportLoading } = usePassport({
    telegram_id,
    room_id,
  })

  useEffect(() => {
    if (passportData && passportData.length === 0) {
      router.push('/')
    } else {
      localStorage.setItem('room_id', room_id)

      // localStorage.setItem("workspace_id", workspace_id);
      setIsPassport(true)
      const fetchToken = async () => {
        try {
          if (typeof roomCode === 'string') {
            const audio = await hmsActions.setLocalAudioEnabled(true)
            console.log(audio, 'audio')
            const authToken = await hmsActions.getAuthTokenByRoomCode({
              roomCode,
            })
            const getUserName = () => {
              if (firstName) {
                return `${firstName} ${lastName || ''}`
              }
              return ''
            }
            setUserName(getUserName())
            setToken(authToken)
            setLoading(false)
          } else {
            throw new Error('roomCode is not a string')
          }
        } catch (error) {
          captureExceptionSentry('Error receiving token', 'MeetsPage')
        }
      }
      fetchToken()
    }
  }, [hmsActions, roomCode, passportData])

  useEffect(() => {
    const handleUnload = async () => {
      if (isConnected) {
        try {
          await hmsActions.leave()
        } catch (error) {
          captureExceptionSentry('Error leaving the room', 'MeetsPage')
        }
      }
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [hmsActions, isConnected])

  return (
    <Layout loading={loading || passportLoading}>
      {isPassport && (
        <Suspense fallback={<Loader />}>
          <HMSPrebuilt roomCode={roomCode as any} options={{ userName }} />
        </Suspense>
      )}
    </Layout>
  )
}

export default Rooms
