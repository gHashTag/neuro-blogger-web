import { NestedBasicIcons } from '@/components/assets/BasicIcons'
import type React from 'react'
import Button from '../common/Button'
import { useDataMessage, useLocalPeer, usePeerIds } from '@huddle01/react/hooks'
import { Role } from '@huddle01/server-sdk/auth'
import { useReactiveVar } from '@apollo/client'
import { setPromptViewVar } from '@/store/reactive-store'

type RequestToSpeakProps = {}

const RequestToSpeak: React.FC<RequestToSpeakProps> = () => {
  const setPromptView = useReactiveVar(setPromptViewVar)

  const { peerId } = useLocalPeer()
  const { sendData } = useDataMessage()

  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.CO_HOST, Role.SPEAKER],
  })

  const sendSpeakerRequest = () => {
    sendData({
      to: peerIds,
      payload: JSON.stringify({
        peerId,
      }),
      label: 'requestToSpeak',
    })
    setPromptViewVar('close')
  }

  return (
    <div className=''>
      <div>{NestedBasicIcons.active.mic}</div>
      <div className='mb-8 mt-4'>
        <div className='text-custom-7 text-xl font-medium'>
          Request to speak
        </div>
        <div className='text-custom-6 max-w-[20rem] text-sm'>
          You will become a speaker once your request is accepted by the Host or
          Co-host
        </div>
      </div>
      <div className='flex items-center justify-center gap-4'>
        <Button
          type='button'
          className='bg-custom-3 text-custom-6 w-36'
          onClick={() => setPromptViewVar('close')}
        >
          Cancel
        </Button>
        <Button
          type='button'
          className='bg-custom-8 w-36'
          onClick={sendSpeakerRequest}
        >
          Send Request
        </Button>
      </div>
    </div>
  )
}
export default RequestToSpeak
