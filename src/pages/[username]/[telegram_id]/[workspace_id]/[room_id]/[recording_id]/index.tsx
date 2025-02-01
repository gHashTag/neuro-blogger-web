'use client'
import React, { useEffect } from 'react'
import Layout from '@/components/layout'
import { TracingBeam } from '@/components/ui/tracing-beam'
import { twMerge } from 'tailwind-merge'
// import { useRouter } from "next/router";
import { DataTable } from '@/components/table/data-table'

// import { Button } from "@/components/ui/moving-border";

import { useTasks } from '@/hooks/useTasks'
import { useUser } from '@/hooks/useUser'
import TaskModal from '@/components/modal/TaskModal'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumb-with-custom-separator'
import { useAssets } from '@/hooks/useAssets'
import { usePath } from '@/hooks/usePath'
import { usePathname } from 'next/navigation'

const RecordingPage = () => {
  // const router = useRouter();
  // const { recording_id } = router.query;
  const { room_name } = useUser()

  const path = usePathname()
  const { username, workspace_id, room_id, recording_id } = usePath(path)

  const { assetData, assetLoading, assetError } = useAssets()

  const {
    tasksData,
    tasksLoading,
    tasksError,
    refetchTasks,
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
    onCreateNewTask,
    columns,
    openModalTaskId,
    setOpenModalTaskId,
  } = useTasks()

  useEffect(() => {
    localStorage.setItem('recording_id', recording_id as string)
  }, [recording_id])

  function HighlightName({ text }: { text: string }) {
    const [name, ...message] = text.split(':')
    const restOfMessage = message.join(':')

    return (
      <span>
        <strong className='text-yellow-500'>{name}</strong>
        {restOfMessage}
      </span>
    )
  }
  const asset = assetData?.room_assetsCollection?.edges[0]?.node
  return (
    <>
      <Layout loading={tasksLoading || assetLoading}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginRight: 20,
            paddingTop: 30,
            flexDirection: 'column',
          }}
        >
          <BreadcrumbWithCustomSeparator
            username={username}
            workspace_id={workspace_id}
            room_id={room_id}
            record_id={recording_id as string}
            room_name={room_name || ''}
          />
          <div style={{ padding: 15 }} />
        </div>
        {asset && (
          <div className='mt-10 flex-col'>
            <TracingBeam className='px-6'>
              <div className='relative mx-auto max-w-2xl px-4 pt-4 antialiased'>
                <div className='mb-1'>
                  <p className={twMerge('mb-4 text-4xl')}>{asset?.title}</p>
                  <p className={twMerge('mb-4 text-xl')}>
                    {asset?.summary_short}
                  </p>

                  <div className='prose prose-sm dark:prose-invert text-sm'>
                    {asset?.transcription
                      .split('\n')
                      .map((line: string, index: number) => (
                        <React.Fragment key={index}>
                          <HighlightName text={line} />
                          <br />
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            </TracingBeam>
          </div>
        )}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "70px",
          }}
        >
          <Button
            onClick={() =>
              onCreateNewTask(workspace_id, room_id, recording_id as string)
            }
          >
            Create task
          </Button>
        </div> */}
        {tasksData && <DataTable data={tasksData} columns={columns} />}
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
        <div style={{ padding: '100px' }} />
      </Layout>
    </>
  )
}

export default RecordingPage
