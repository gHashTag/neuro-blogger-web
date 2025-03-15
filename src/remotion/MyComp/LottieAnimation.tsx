'use client'
import { LottieAnimationData } from '@remotion/lottie'
import { useEffect, useState, useRef } from 'react'
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
// import Lottie from "lottie-react";
type LottieProps = {
  animationPath: string
  width?: number
  height?: number
}

const validateLottieData = (data: unknown): LottieAnimationData => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid Lottie data format')
  }

  const requiredKeys = ['fr', 'w', 'h', 'op', 'layers']
  const missingKeys = requiredKeys.filter(key => !(key in data))

  if (missingKeys.length > 0) {
    throw new Error(`Missing Lottie properties: ${missingKeys.join(', ')}`)
  }

  return data as LottieAnimationData
}

export const LottieAnimation = ({
  animationPath,
  width = 1920,
  height = 1080,
}: LottieProps) => {
  const [handle] = useState(() => delayRender('Loading Lottie animation'))

  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null)

  useEffect(() => {
    fetch(staticFile(animationPath))
      .then(data => data.json())
      .then(json => {
        setAnimationData(json)
        continueRender(handle)
      })
      .catch(err => {
        cancelRender(err)
        console.log('Animation failed to load', err)
      })
  }, [handle])

  if (!animationData) {
    return null
  }

  return (
    <Lottie
      animationData={animationData}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: '0 auto',
      }}
    />
  )
}
