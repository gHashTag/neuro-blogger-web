'use client'
import { retrieveLaunchParams } from '@telegram-apps/sdk'

const BabaYaga = () => {
  const { initData } = retrieveLaunchParams()

  return <div>{JSON.stringify(initData)}</div>
}

export default BabaYaga
