import React from 'react'

type ChildProps = {
  data: any
  className?: string
}

export const ChildComponent: React.FC<ChildProps> = ({ data, className }) => {
  return <div className={className}>{data}</div>
}
