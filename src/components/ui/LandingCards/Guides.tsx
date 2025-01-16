import CommonIcons from '@components/assets/CommonIcons'
import { useRouter } from 'next/router'
import React from 'react'

const Guides: React.FC = () => {
  const { push } = useRouter()
  return (
    <div
      className='bg-rgb-5 border-rgb-5 mt-6 flex w-full cursor-pointer items-center justify-between !rounded-md border px-2.5 py-2'
      role='presentation'
      onClick={() => push('/guides')}
    >
      <div className='flex items-center gap-2'>
        <div>{CommonIcons.backpack}</div>
        <div className='text-rgb-14 text-xs font-semibold'>
          Check out our other guides.
        </div>
      </div>

      <div>{CommonIcons.smallArrowRight}</div>
    </div>
  )
}
export default Guides
