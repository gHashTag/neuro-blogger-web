import { useState } from 'react'

const RippleAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return isVisible ? (
    <div className='absolute inset-0 flex items-center justify-center'>
      <div
        className='absolute animate-ripple rounded-full border border-blue-500'
        style={{
          width: '150px',
          height: '150px',
          top: '0px',
          right: '-16px',
        }}
      ></div>
      <div
        className='absolute animate-ripple2 rounded-full border border-blue-500'
        style={{
          width: '150px',
          height: '150px',
          top: '0px',
          right: '-16px',
        }}
      ></div>
    </div>
  ) : null
}
export default RippleAnimation
