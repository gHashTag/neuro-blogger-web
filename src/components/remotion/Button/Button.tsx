import React, { forwardRef } from 'react'
import { Spacing } from '../Spacing'
import { Spinner } from '../Spinner/Spinner'

const ButtonForward: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  {
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
    loading?: boolean
    secondary?: boolean
  }
> = ({ onClick, disabled, children, loading, secondary }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center border transition-all duration-150 ease-in-out ${secondary ? 'text-brand border-unfocused-border-color bg-transparent' : 'text-brand border-brand bg-background'} ${disabled ? 'bg-button-disabled-color text-disabled-text-color border-unfocused-border-color cursor-not-allowed' : 'hover:border-#ffffff-500 hover:bg-gray-200 hover:text-black'} h-10 appearance-none rounded-[var(--geist-border-radius)] px-[var(--geist-half-pad)] text-sm font-medium`}
    >
      {loading && (
        <>
          <Spinner size={20} />
          <Spacing />
        </>
      )}
      {children}
    </button>
  )
}

export const Button = forwardRef(ButtonForward)
