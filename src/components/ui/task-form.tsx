'use client'
import { Fragment, useEffect } from 'react'
import { Label } from './label'
import { Input } from './input'
import { cn } from '@/utils/cn'
import { useRouter } from 'next/router'
import {
  SubmitHandler,
  FieldValues,
  UseFormHandleSubmit,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ButtonAnimate } from './button-animate'
import { priorities, statuses } from '@/helpers/data/data'
import { useReactiveVar } from '@apollo/client'
import { setEditTask } from '@/store/reactive-store'
import { useUser } from '@/hooks/useUser'
import { AnimatedTooltipTasks } from './animated-tooltip-tasks'
import { usePassport } from '@/hooks/usePassport'
import InviteMemberModal from '../modal/InviteMemberModal'
import { AssignedTo, Passport } from '@/interfaces'

export function TaskForm({
  id,
  title,
  description,
  priority,
  status,
  cost,
  is_public,
  handleSubmitTask,
  watchTask,
  setValueTask,
  onUpdateTask,
  telegram_id,
}: // assigned_to,
{
  id: string
  title: string
  description: string
  priority: string
  status: string
  cost: string
  is_public: boolean
  created_at?: string
  updated_at?: string
  handleSubmitTask: UseFormHandleSubmit<FieldValues>
  watchTask: UseFormWatch<FieldValues>
  setValueTask: UseFormSetValue<FieldValues>
  onUpdateTask: (id: string) => void
  telegram_id: string
  // assigned_to: string | undefined;
}) {
  const router = useRouter()
  const task_id: string = router.query.task_id as string
  // const assignedTo = JSON.parse(assigned_to || "[]");
  const watchedTitle = watchTask('title', title)
  const watchedDescription = watchTask('description', description)
  const watchedPriority = watchTask('priority', priority)
  const watchedStatus = watchTask('status', status)
  const watchedCost = watchTask('cost', cost)
  const watchedPublic = watchTask('is_public', is_public)

  const isEditTask = useReactiveVar(setEditTask)

  const { telegram_id: owner_telegram_id, workspace_id, room_id } = useUser()

  const isOwnerTask = owner_telegram_id === Number(telegram_id)

  useEffect(() => {
    localStorage.setItem('is_owner', 'false')
    const subscription = watchTask((value, { name, type }) => {
      console.log('Watch update:', value, name)
    })
    return () => subscription.unsubscribe()
  }, [watchTask])

  const {
    passportData,
    passportLoading,
    passportError,
    isOpenModalPassport,
    onOpenModalPassport,
    onOpenChangeModalPassport,
    onCreatePassport,
    onDeletePassportTask,
    onUpdatePassport,
    setValuePassport,
    controlPassport,
    handleSubmitPassport,
    getValuesPassport,
    openModalPassportId,
    isEditingPassport,
  } = usePassport({
    room_id,
    task_id,
    type: 'task',
    // assigned_to: assignedTo,
  })

  const onSubmitDestination: SubmitHandler<FieldValues> = (
    data: FieldValues
  ) => {
    onUpdateTask(id)
  }

  const onDeleteAssignee = ({ node }: Passport) => {
    node.passport_id &&
      node.telegram_id &&
      onDeletePassportTask(node.passport_id, node.telegram_id)
  }

  const handleClickPlus = async () => {
    onOpenModalPassport()
  }

  return (
    <div className='mx-auto w-full max-w-2xl rounded-none bg-transparent p-4 shadow-input dark:bg-transparent md:rounded-2xl md:p-8'>
      <form className='my-8' onSubmit={handleSubmitTask(onSubmitDestination)}>
        {isEditTask ? (
          <div className='ounded-md rounded-md border border-input bg-transparent px-6 py-6'>
            <div className='mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0'>
              <LabelInputContainer>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  type='text'
                  value={watchedTitle}
                  onChange={e => setValueTask('title', e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <div className='mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0'>
              <LabelInputContainer>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  type='text'
                  value={watchedDescription}
                  onChange={e => setValueTask('description', e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <div style={{ padding: '5px' }} />
            <div
              className='mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0'
              style={{ justifyContent: 'space-between' }}
            >
              <Select onValueChange={value => setValueTask('priority', value)}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder={watchedPriority} />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(({ value }) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='public-task'
                  checked={watchedPublic}
                  onCheckedChange={() =>
                    setValueTask('is_public', !watchedPublic)
                  }
                />
                <Label htmlFor='public-task'>Public</Label>
              </div>

              <Select onValueChange={value => setValueTask('status', value)}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder={watchedStatus} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(({ value }) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {watchedPublic && (
              <LabelInputContainer>
                <Label htmlFor='cost'>Cost, TON</Label>
                <Input
                  id='cost'
                  type='text'
                  defaultValue='0'
                  value={watchedCost}
                  onChange={e => setValueTask('cost', e.target.value)}
                />
              </LabelInputContainer>
            )}
            <div style={{ padding: '10px' }} />
            {/* <AnimatedTooltipTasks
              assigneeItems={passportData}
              onClick={onDeleteAssignee}
              handleClickPlus={handleClickPlus}
            /> */}
            {isOpenModalPassport && (
              <InviteMemberModal
                isOpen={isOpenModalPassport}
                onOpen={onOpenModalPassport}
                onOpenChange={onOpenChangeModalPassport}
                onCreate={onCreatePassport}
                onDelete={() =>
                  openModalPassportId &&
                  onDeletePassportTask(openModalPassportId, telegram_id)
                }
                onUpdate={onUpdatePassport}
                control={controlPassport}
                handleSubmit={handleSubmitPassport}
                getValues={getValuesPassport}
                setValue={setValuePassport}
                isEditing={isEditingPassport}
                type='task'
              />
            )}
            <div style={{ padding: '10px' }} />
            <ButtonAnimate
              onClick={() => {
                setTimeout(() => setEditTask(false), 1000)
                router.back()
              }}
            >
              Save
            </ButtonAnimate>
          </div>
        ) : (
          <div className='ounded-md rounded-md border border-input bg-transparent px-6 py-6'>
            <h2 className='text-3xl font-bold text-neutral-800 dark:text-neutral-200'>
              {title}
            </h2>

            <p className='text-md mt-2 max-w-full text-neutral-600 dark:text-neutral-300'>
              {description &&
                description.split('\n').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
            </p>
            <div style={{ padding: '5px' }} />
            <div className='mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0'>
              <Badge variant='outline'>{priority}</Badge>
              <Badge variant='outline'>{status}</Badge>
            </div>

            {isOwnerTask && (
              <>
                {/* <AnimatedTooltipTasks
                  assigneeItems={passportData}
                  onClick={onDeleteAssignee}
                  handleClickPlus={handleClickPlus}
                  isVisiblePlus={isEditTask}
                /> */}
                <div style={{ padding: '10px' }} />
                <ButtonAnimate onClick={() => setEditTask(true)}>
                  Edit
                </ButtonAnimate>
              </>
            )}
            {/* 
            <ButtonAnimate onClick={logout}>Logout</ButtonAnimate> */}
          </div>
        )}
      </form>
    </div>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  )
}
