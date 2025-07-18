'use client'
import Image from 'next/image'
import React from 'react'
import { useMotionValue } from 'framer-motion'
import { Passport, PassportArray } from '@/interfaces'
import { Avatar } from '@heroui/react'

type AnimatedTooltipRoomsProps = {
  assigneeItems: Passport[]
  onClick: (passport_id: number) => void
  handleClickPlus: () => void
  isVisiblePlus?: boolean
}

export const AnimatedTooltipRooms = ({
  assigneeItems,
  onClick,
  handleClickPlus,
  isVisiblePlus = true,
}: AnimatedTooltipRoomsProps) => {
  const x = useMotionValue(0)

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth) // set the x value, which is then used in transform and rotate
  }

  const handleClick = (passport_id: number) => {
    onClick(passport_id)
  }

  console.log(assigneeItems, 'assigneeItems')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        className='group relative -mr-4 rounded-full'
        style={{
          right: 8,
        }}
        onClick={() => handleClickPlus()}
      >
        {isVisiblePlus && (
          <img src='/icon-plus.svg' height={50} width={50} alt='plus' />
        )}
      </div>
      {assigneeItems &&
        assigneeItems.map((item: Passport) => (
          <div
            className='group relative -mr-4 rounded-full'
            key={item.node.photo_url}
            onClick={() => handleClick(item.node.passport_id || 0)}
          >
            {item.node.photo_url ? (
              <Image
                onMouseMove={handleMouseMove}
                height={50}
                width={50}
                // @ts-ignore
                src={item.node.photo_url}
                alt='avatar'
                className='relative !m-0 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105'
              />
            ) : (
              <Avatar
                onMouseMove={handleMouseMove}
                name={`${item?.node?.first_name?.charAt(
                  0
                )}${item?.node?.last_name?.charAt(0)}`}
                className='relative !m-0 rounded-full border-2 border-white object-cover object-top !p-0 text-large transition duration-500 group-hover:z-30 group-hover:scale-105'
                style={{
                  height: 51,
                  width: 51,
                  backgroundColor: '#282524',
                  border: '2px solid white',
                }}
              />
            )}
          </div>
        ))}
    </div>
  )
}
