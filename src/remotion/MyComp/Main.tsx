import React, { useMemo, useState, useEffect } from 'react'
import { z } from 'zod'
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from 'remotion'
import { Lottie, LottieAnimationData } from '@remotion/lottie'
import { NextLogo } from './NextLogo'
import { loadFont, fontFamily } from '@remotion/google-fonts/Inter'

import { Rings } from './Rings'
import { TextFade } from './TextFade'
import { CompositionProps } from '@/interfaces/remotion.interface'
import { LottieAnimation } from './LottieAnimation'

loadFont()

const container: React.CSSProperties = {
  backgroundColor: '#222020',
}

const logo: React.CSSProperties = {
  justifyContent: 'center',
  alignItems: 'center',
}

export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const transitionStart = 2 * fps
  const transitionDuration = 1 * fps

  const logoOut = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: transitionDuration,
    delay: transitionStart,
  })

  const titleStyle: React.CSSProperties = useMemo(() => {
    return { fontFamily, fontSize: 70, color: '#f6ff00' }
  }, [])

  return (
    <AbsoluteFill style={container}>
      <LottieAnimation
        animationPath='news.json' // Файл должен быть в public/
        width={1280}
        height={720}
      />
    </AbsoluteFill>
  )
}
