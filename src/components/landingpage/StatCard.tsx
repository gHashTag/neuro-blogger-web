import React from 'react'

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  description: string
}

export function StatCard({ icon, value, label, description }: StatCardProps) {
  return (
    <div className='rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-lg'>
      <div className='mb-4'>{icon}</div>
      <div className='mb-1 text-3xl font-bold'>{value}</div>
      <div className='mb-1 text-lg font-semibold text-gray-900'>{label}</div>
      <div className='text-sm text-gray-600'>{description}</div>
    </div>
  )
}
