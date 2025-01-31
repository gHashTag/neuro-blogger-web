import * as React from 'react'
import SubCard from '@/components/ui/LandingCards/SubCard'

const cardsCreateRoom = [
  {
    title: 'Video Space',
    img: '/images/Video Space.png',
    onClickType: 'video-space',
    isDisabled: false,
  },
  {
    title: 'Audio Space',
    img: '/images/Audio Space.png',
    onClickType: 'audio-space',
    isDisabled: false,
  },
  {
    title: 'Token-gated',
    img: '/images/Token-gated.png',
    onClickType: 'token-gated',
    isDisabled: true,
  },
]

const SelectRoom = ({
  setOpenModalType,
}: {
  setOpenModalType: (type: string) => void
}) => {
  return (
    <>
      <div
        className='flex-col'
        style={{
          paddingTop: 10,
          paddingRight: 80,
          paddingLeft: 80,
        }}
      >
        <div className='mt-6 grid grid-cols-3 gap-4 lg:grid-cols-3'>
          {cardsCreateRoom.map(card => (
            <SubCard
              key={card.title}
              title={card.title}
              img={card.img}
              onClick={() => setOpenModalType(card.onClickType)}
              isDisabled={card.isDisabled}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export { SelectRoom }
