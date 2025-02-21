import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import MeetModal from '@/components/modal/meet-modal'

import { SelectRoom } from '@/components/ui/select-room'

import { useReactiveVar } from '@apollo/client'
import { Passport, RoomEdge, Task, TaskNode } from '@/interfaces'
import CardRoom from '@/components/ui/card-room'
import { DataTable } from '@/components/table/data-table'

import { setLoading, setRoomId } from '@/store/reactive-store'
import { useUser } from '@/hooks/useUser'
import { useTasks } from '@/hooks/useTasks'
import TaskModal from '@/components/modal/TaskModal'
import { useRooms } from '@/hooks/useRooms'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumb-with-custom-separator'
import { usePassport } from '@/hooks/usePassport'
import { getAssignedTasks } from '@/core/supabase/supabase'
import { usePathname } from 'next/navigation'
import { usePath } from '@/hooks/usePath'

type PassportType = {
  telegram_id?: number
  workspace_id?: number
  room_id?: string
  is_owner: boolean
  type?: string
}

const MeetsPage = () => {
  const router = useRouter()
  const loading = useReactiveVar(setLoading)
  // const room_id = useReactiveVar(setRoomId);
  const { telegram_id, workspace_type } = useUser()
  // const { username, telegram_id, workspace_id, workspace_type } = useUser();

  const path = usePathname()
  const { username, workspace_id } = usePath(path)
  console.log(workspace_id, 'usePath workspace_id')

  const passportObj: PassportType =
    workspace_type === 'Water'
      ? {
          telegram_id,
          is_owner: false,
          type: 'room',
        }
      : {
          telegram_id,
          is_owner: true,
          type: 'room',
        }

  const { passportData } = usePassport(passportObj)

  const {
    tasksData,
    isOpenModalTask,
    onOpenModalTask,
    onOpenChangeModalTask,
    onCreateTask,
    onDeleteTask,
    onUpdateTask,
    setValueTask,
    controlTask,
    handleSubmitTask,
    getValuesTask,
    columns,
    openModalTaskId,
  } = useTasks()

  const {
    roomsData,
    roomsLoading,
    refetchRooms,
    isOpenMeet,
    onOpenMeet,
    onOpenChangeRoom,
    setOpenModalRoomId,
    controlRoom,
    handleSubmitRoom,
    getValuesRoom,
    setValueRoom,
    onCreateRoom,
    isEditingRoom,
    openModalRoomId,
    onDeleteRoom,
    onUpdateRoom,
    watchRoom,
    inviteHostCode,
    setInviteHostCode,
  } = useRooms()
  const [assignedTasks, setAssignedTasks] = useState<Task[]>()

  const assigned = async () => {
    const result = await getAssignedTasks(telegram_id)
    setAssignedTasks(result)
    return result
  }

  useEffect(() => {
    if (!username) {
      router.push('/')
    } else {
      setLoading(false)

      if (Number(workspace_id) === 1) {
        console.log('Copper pipes')
        // "Copper pipes"
        localStorage.setItem('workspace_type', 'Copper pipes')
        // setIsVisibleMenu(false);
        // setIsVisibleTask(true);
        localStorage.setItem('is_owner', 'true')
      } else if (Number(workspace_id) === 2) {
        // "Water",
        console.log('Water')
        assigned()
        localStorage.setItem('is_owner', 'false')
        localStorage.setItem('room_id', '')
        localStorage.setItem('workspace_type', 'Water')
        // setIsVisibleTask(false);
      } else {
        // "Fire"
        console.log('Fire')
        localStorage.setItem('workspace_type', 'Fire')
        localStorage.setItem('workspace_id', workspace_id)

        localStorage.setItem('is_owner', 'true')
        // setIsVisibleTask(true);
        //
        localStorage.setItem('room_name', '')
        localStorage.setItem('room_id', '')
        localStorage.setItem('recording_id', '')
        localStorage.setItem('recording_name', '')
      }
    }

    router.events.on('routeChangeComplete', url => {
      refetchRooms()
    })
  }, [workspace_id])

  const setOpenModalType = async (type: string) => {
    onOpenMeet()
    setOpenModalRoomId(type)
  }

  const goToRoomId = (room: RoomEdge) => {
    console.log(room, 'goToRoomId room')
    // localStorage.setItem("is_owner", "false");
    router.push(
      `/${username}/${telegram_id}/${workspace_id}/${room.node.room_id}`
    )
    const room_code = room.node.room_code
    console.log(room_code, 'goToRoomId: room_code')
    setInviteHostCode(room_code)
    localStorage.setItem('room_code', room_code)
    localStorage.setItem('room_id', room.node.room_id)
    setRoomId(room.node.room_id)
    localStorage.setItem('room_name', room.node.name)
  }

  const goToMeet = ({ node }: Passport) => {
    console.log(node, 'goToMeet node')
    if (node?.rooms?.room_code) {
      const room_code = node.rooms.room_code
      console.log(room_code, 'goToMeet: room_code')
      setInviteHostCode(room_code)
      localStorage.setItem('workspace_id', workspace_id)
      router.push(
        `/${node.username}/${telegram_id}/${node.workspace_id}/${node.room_id}/meet/${room_code}`
      )
    } else {
      console.error('No room_code available')
    }
  }

  return (
    <Layout loading={roomsLoading}>
      <div className='flex flex-col items-center justify-between'>
        <BreadcrumbWithCustomSeparator
          username={username}
          workspace_id={workspace_id}
        />
      </div>

      {workspace_type === 'Fire' && (
        <>
          <SelectRoom setOpenModalType={setOpenModalType} />

          <div
            className='grid grid-cols-1 gap-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'
            style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
          >
            {roomsData?.roomsCollection.edges.map((room: RoomEdge) => (
              <CardRoom
                room={room.node}
                onClick={() => goToRoomId(room)}
                key={room.node.id}
                room_id={room.node.room_id}
                username={room.node.username}
              />
            ))}
          </div>
        </>
      )}

      {workspace_type === 'Water' && (
        <div
          className='grid grid-cols-1 gap-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'
          style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 50 }}
        >
          {passportData &&
            passportData.map((item: Passport, index) => {
              return (
                <CardRoom
                  key={index}
                  room={item.node.rooms}
                  room_id={item.node.room_id}
                  username={item.node.username}
                  onClick={() => goToMeet(item)}
                  is_owner={item.node.is_owner}
                />
              )
            })}
        </div>
      )}

      <div
        style={{
          paddingBottom: 200,
        }}
      >
        {workspace_type === 'Fire' && tasksData && (
          <DataTable data={tasksData} columns={columns} />
        )}

        {workspace_type === 'Water' && assignedTasks && (
          <DataTable data={assignedTasks} columns={columns} />
        )}

        {workspace_type === 'Copper pipes' && tasksData && (
          <DataTable data={tasksData} columns={columns} />
        )}
      </div>
      {isOpenModalTask && (
        <TaskModal
          isOpen={isOpenModalTask}
          onOpen={onOpenModalTask}
          onOpenChange={onOpenChangeModalTask}
          onCreate={onCreateTask}
          onDelete={() => openModalTaskId && onDeleteTask(openModalTaskId)}
          onUpdate={() => openModalTaskId && onUpdateTask(openModalTaskId)}
          control={controlTask}
          handleSubmit={handleSubmitTask}
          getValues={getValuesTask}
          setValue={setValueTask}
        />
      )}
      {isOpenMeet && (
        <MeetModal
          isOpen={isOpenMeet}
          onOpen={onOpenMeet}
          onOpenChange={onOpenChangeRoom}
          control={controlRoom}
          handleSubmit={handleSubmitRoom}
          getValues={getValuesRoom}
          setValue={setValueRoom}
          isEditing={isEditingRoom}
          onCreate={onCreateRoom}
          onDelete={onDeleteRoom}
          onUpdate={onUpdateRoom}
          watchRoom={watchRoom}
        />
      )}
    </Layout>
  )
}

export default MeetsPage
