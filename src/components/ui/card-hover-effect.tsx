import { useUser } from '@/hooks/useUser'
import { RecordingAsset } from '@/interfaces'
import { cn } from '@/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'

import { useState } from 'react'
import { useRouter } from 'next/router'

type HoverEffectProps = {
  items: {
    node: RecordingAsset
  }[]
  className?: string
}

export const HoverEffect = ({ items, className }: HoverEffectProps) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter()
  const { username, telegram_id, workspace_id } = useUser()

  const goToRecordId = (item: { node: RecordingAsset }) => {
    localStorage.setItem('recording_id', item.node.recording_id)
    localStorage.setItem('recording_name', item.node.title)
    router.push(
      `/${username}/${telegram_id}/${workspace_id}/${item.node.room_id}/${item.node.recording_id}`
    )
  }

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 py-10 md:grid-cols-3 lg:grid-cols-6',
        className
      )}
    >
      {items &&
        items.map((item, idx) => (
          <div
            onClick={() => goToRecordId(item)}
            key={item.node.recording_id}
            className='group relative block h-full w-full p-2'
            onMouseEnter={() => {
              setHoveredIndex(idx)
              localStorage.setItem('recording_id', item.node.recording_id)
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className='absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200 dark:bg-yellow-600/[0.8]'
                  layoutId='hoverBackground'
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <CardTitle>{item.node.title}</CardTitle>
              <CardDescription>{item.node.summary_short}</CardDescription>
            </Card>
          </div>
        ))}
    </div>
  )
}

export const Card = ({
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'h-42 w-45 relative z-20 overflow-hidden rounded-2xl border border-transparent p-4 group-hover:border-black dark:border-yellow-500/[0.2]'
      )}
      style={{
        backgroundColor: 'var(--main-background)',
      }}
    >
      <div className='relative z-50'>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  )
}
export const CardTitle = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <h4
      className={cn('mt-0 font-bold tracking-wide text-zinc-100', className)}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {children}
    </h4>
  )
}
export const CardDescription = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <p
      className={cn(
        'mt-3 h-full text-sm leading-relaxed tracking-wide text-zinc-400',
        className
      )}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {children}
    </p>
  )
}
