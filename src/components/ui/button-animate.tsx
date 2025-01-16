import * as React from 'react'

const ButtonAnimate = ({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) => {
  return (
    <button
      className='group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'
      type='submit'
      onClick={onClick}
    >
      {children}
      <BottomGradient />
    </button>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className='absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100' />
      <span className='absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100' />
    </>
  )
}

ButtonAnimate.displayName = 'ButtonAnimate'

export { ButtonAnimate, BottomGradient }
