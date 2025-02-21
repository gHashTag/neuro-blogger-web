import React from 'react'

// Common
import OverlayContainer from './OverlayContainer'
import { useReactiveVar } from '@apollo/client'
import { setPromptViewVar } from '@/store/reactive-store'
import RequestToSpeak from '../Modals/RequestToSpeak'

type PromptsProps = {}

const Prompts: React.FC<PromptsProps> = () => {
  const promptView = useReactiveVar(setPromptViewVar)

  const prompt = {
    'request-to-speak': <RequestToSpeak />,
  } as const

  if (promptView === 'close') return null

  return (
    <OverlayContainer onClick={() => setPromptViewVar('close')}>
      {prompt[promptView as keyof typeof prompt]}
    </OverlayContainer>
  )
}
export default React.memo(Prompts)
