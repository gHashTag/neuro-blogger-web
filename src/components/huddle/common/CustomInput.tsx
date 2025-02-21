import { InputIcons } from '@/components/assets/InputIcons'
import { cn } from '@/lib/utils'
import React, { type ChangeEvent } from 'react'

type CustomInputProps = {
  type: string
  className?: string
  name?: string
  value: string
  placeholder: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const CustomInput: React.FC<CustomInputProps> = ({
  className,
  name,
  value,
  onChange,
  type,
  placeholder,
}) => {
  return (
    <div
      className={cn(
        'bg-rgbColors-2 flex items-center gap-3 rounded-lg p-2',
        className
      )}
    >
      <div>{InputIcons[type]}</div>
      <input
        type='text'
        name={name}
        value={value}
        onChange={e => onChange(e)}
        placeholder={placeholder}
        className='border-none bg-transparent text-sm font-normal text-slate-50 placeholder:text-slate-500 focus:outline-none'
      />
    </div>
  )
}
export default React.memo(CustomInput)
