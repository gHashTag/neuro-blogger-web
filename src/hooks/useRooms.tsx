import { useCallback, useEffect, useState } from 'react'

import {
  ApolloError,
  useMutation,
  useQuery,
  useReactiveVar,
} from '@apollo/client'
import { createRoom } from '@/services/createRoom'
import {
  DELETE_ROOM_MUTATION,
  GET_ROOMS_COLLECTIONS_BY_telegram_id_QUERY,
  GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY,
  GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY,
  ROOMS_BY_ID_COLLECTION_QUERY,
  ROOM_NAME_COLLECTION_QUERY,
  UPDATE_ROOM_MUTATION,
} from '@/graphql/query.rooms'

import { useUser } from './useUser'
import { useToast } from '@/components/ui/use-toast'
// @ts-ignore
import { useDisclosure } from '@heroui/react'
import { useRouter } from 'next/router'
import { ArrayInviteT, RoomEdge, RoomNode, RoomsData } from '@/interfaces'
import { setLoading, setRoomId } from '@/store/reactive-store'
import { useAssets } from './useAssets'
import {
  Control,
  FieldValues,
  Resolver,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form'
import { usePassport } from './usePassport'
import { captureExceptionSentry } from '@/utils/sentry'

export type FormValues = {
  id: string
  name: string
  token: string
  chat_id: string
}

const resolver: Resolver<FormValues> = async values => {
  console.log(values, 'values')
  return {
    values: values.name || values.token || values.chat_id ? values : {},
    errors:
      !values.name || !values.token || !values.chat_id
        ? {
            name: {
              type: 'required',
              message: 'This is required.',
            },
            token: {
              type: 'required',
              message: 'This is required.',
            },
            chat_id: {
              type: 'required',
              message: 'This is required.',
            },
          }
        : {},
  }
}

const useRooms = (): UseRoomsReturn => {
  console.log('CASE: useRooms')
  const { createPassport } = usePassport({})
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { register, control, handleSubmit, getValues, setValue, reset, watch } =
    useForm<FormValues>({ resolver })
  const [inviteGuestCode, setInviteGuestCode] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [inviteHostCode, setInviteHostCode] = useState('')
  const [openModalRoomId, setOpenModalRoomId] = useState('')
  const [inviteMemberCode, setInviteMemberCode] = useState('')

  const [deleteRoom, { loading: deleteRoomLoading, error: deleteRoomError }] =
    useMutation(DELETE_ROOM_MUTATION)

  const [updateRoom, { loading: updateRoomLoading, error: updateRoomError }] =
    useMutation(UPDATE_ROOM_MUTATION)

  if (deleteRoomError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(deleteRoomError, 'deleteRoomError')
  }

  const router = useRouter()
  const { toast } = useToast()

  const {
    username,
    telegram_id,
    workspace_id,
    room_id,
    recording_id,
    language_code,
  } = useUser()
  // console.log('username', username)
  // console.log('telegram_id', telegram_id)
  // console.log('workspace_id', workspace_id)
  // console.log('room_id', room_id)
  // console.log('recording_id', recording_id)

  let queryVariables
  // console.log(queryVariables, "queryVariables");
  let passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY
  console.log('passportQuery', passportQuery)
  if (!room_id && !recording_id && !workspace_id) {
    console.log('rooms :::1')
    passportQuery = ROOMS_BY_ID_COLLECTION_QUERY
    queryVariables = {
      telegram_id,
    }
  }

  if (!room_id && !recording_id && workspace_id) {
    console.log(
      `rooms :::2 workspace_id: ${workspace_id}, telegram_id: ${telegram_id}`
    )
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY
    queryVariables = {
      telegram_id,
      workspace_id,
    }
  }

  if (recording_id && !room_id && !workspace_id) {
    console.log('rooms :::3')
    passportQuery = GET_ROOMS_COLLECTIONS_BY_telegram_id_QUERY
    queryVariables = {
      telegram_id,
    }
  }

  if (!recording_id && room_id && workspace_id) {
    console.log('rooms :::4')
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY
    queryVariables = {
      telegram_id,
      room_id,
      workspace_id,
    }
  }

  if (recording_id && room_id && workspace_id) {
    console.log('rooms :::5')
    passportQuery = GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY
    queryVariables = {
      telegram_id,
      room_id,
      workspace_id,
    }
  }

  const {
    data: roomsData,
    loading: roomsLoading,
    refetch: refetchRooms,
    // @ts-ignore
  } = useQuery(passportQuery, {
    fetchPolicy: 'network-only',
    variables: queryVariables,
  })
  console.log(roomsData, 'roomsData')

  const roomId = useReactiveVar(setRoomId)
  console.log(roomId, 'roomId useReactiveVar')

  const {
    data: roomNameData,
    loading: roomNameLoading,
    error: roomNameError,
    refetch: roomNameRefetch,
  } = useQuery(ROOM_NAME_COLLECTION_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      room_id: roomId,
    },
  })

  if (roomNameError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(roomNameError.message)
  }

  const { assetsRefetch } = useAssets()

  const inviteToMeet = useCallback(
    async (type: string) => {
      const room_code =
        await roomNameData?.roomsCollection?.edges[0]?.node?.room_code
      console.log('room_code', room_code)
      setInviteGuestCode(room_code)
    },
    [roomNameData]
  )

  useEffect(() => {
    inviteToMeet('host')
    inviteToMeet('member')
    inviteToMeet('guest')
  }, [roomNameData, inviteToMeet])

  const arrayInvite = [
    {
      text: 'Start Meet',
      type: 'host',
    },
    {
      text: 'Invite Member',
      type: 'member',
    },
    {
      text: 'Invite Guest',
      type: 'guest',
    },
  ]

  const handlerEditRoom = useCallback(() => {
    setIsEditing(true)
    onOpen()
  }, [onOpen, setIsEditing])

  const onCreateRoom = useCallback(async () => {
    setLoading(true)
    const formData = getValues()

    try {
      if (username && telegram_id) {
        const response = await createRoom({
          telegram_id,
          username,
          name: formData.name,
          type: openModalRoomId,
          token: formData.token,
          chat_id: formData.chat_id,
          language_code: language_code || 'ru',
        })

        if (response) {
          localStorage.setItem('room_name', response.rooms.name)
          const room_id = response.rooms.room_id

          setRoomId(room_id)
          localStorage.setItem('room_id', room_id)

          createPassport(workspace_id, room_id, true)
          router.push(
            `/${username}/${telegram_id}/${workspace_id}/${response.rooms.room_id}`
          )
          setLoading(false)
          toast({
            title: 'Success',
            description: `${response.rooms.name} created`,
          })
        }
      } else {
        console.log('Username not a found')
      }
    } catch (error) {
      captureExceptionSentry('Error creating room', 'useRooms')
      if (error) {
        toast({
          title: 'Error creating room',
          variant: 'destructive',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        })
      } else {
        reset({
          name: '',
          token: '',
          chat_id: '',
        })
      }
    }
  }, [
    createPassport,
    getValues,
    language_code,
    router,
    toast,
    username,
    telegram_id,
    workspace_id,
    reset,
    openModalRoomId,
  ])

  const onUpdateRoom = useCallback(() => {
    const values = getValues()
    updateRoom({
      variables: {
        id: values.id,
        name: values.name,
        chat_id: values.chat_id,
        token: values.token,
      },
      onCompleted: data => {
        toast({
          title: 'Success! Room updated',
        })

        localStorage.setItem('room_name', values.name)
        refetchRooms()
        assetsRefetch()
        roomNameRefetch()
      },
    })
  }, [
    getValues,
    updateRoom,
    toast,
    refetchRooms,
    assetsRefetch,
    roomNameRefetch,
  ])

  const onDeleteRoom = useCallback(() => {
    deleteRoom({
      variables: {
        room_id,
      },
      onCompleted: data => {
        toast({
          title: 'Success! Room deleted',
        })
        refetchRooms()
        assetsRefetch()
        roomNameRefetch()
        router.push(`/${username}/${telegram_id}/${workspace_id}`)
      },
    })
  }, [
    deleteRoom,
    toast,
    refetchRooms,
    assetsRefetch,
    roomNameRefetch,
    router,
    username,
    telegram_id,
    workspace_id,
    room_id,
  ])

  return {
    roomsItem: roomsData?.roomsCollection?.edges[0]?.node,
    roomsData,
    refetchRooms,
    handlerEditRoom,
    deleteRoomLoading,
    arrayInvite,
    roomsLoading,
    roomNameLoading,
    inviteToMeet,
    inviteGuestCode,
    inviteHostCode,
    inviteMemberCode,
    registerRoom: register,
    isOpenMeet: isOpen,
    onOpenMeet: onOpen,
    onOpenChangeRoom: onOpenChange,
    openModalRoomId,
    reset,
    setOpenModalRoomId,
    controlRoom: control,
    handleSubmitRoom: handleSubmit,
    getValuesRoom: getValues,
    setValueRoom: setValue,
    onCreateRoom,
    onUpdateRoom,
    onDeleteRoom,
    setIsEditingRoom: setIsEditing,
    isEditingRoom: isEditing,
    watchRoom: watch,
    setInviteHostCode,
  }
}

type UseRoomsReturn = {
  roomsData: RoomsData
  roomsItem: RoomNode
  watchRoom: UseFormWatch<FormValues>
  refetchRooms: () => void

  handlerEditRoom: () => void
  deleteRoomLoading: boolean
  arrayInvite: ArrayInviteT[]

  roomsLoading: boolean
  roomNameLoading: boolean
  inviteToMeet: (type: string) => void
  inviteGuestCode: string
  inviteHostCode: string
  inviteMemberCode: string
  registerRoom: UseFormRegister<FormValues>
  isOpenMeet: boolean
  onOpenMeet: () => void
  onOpenChangeRoom: () => void
  controlRoom: Control<FormValues, any>
  handleSubmitRoom: UseFormHandleSubmit<FormValues, undefined>
  getValuesRoom: () => FieldValues
  setValueRoom: UseFormSetValue<FormValues>
  reset: () => void
  openModalRoomId: string
  setOpenModalRoomId: (openModalRoomId: string) => void
  onCreateRoom: () => void
  onUpdateRoom: () => void
  onDeleteRoom: () => void
  setIsEditingRoom: (isEditing: boolean) => void
  isEditingRoom: boolean
  setInviteHostCode: (inviteHostCode: string) => void
}

export { useRooms }
