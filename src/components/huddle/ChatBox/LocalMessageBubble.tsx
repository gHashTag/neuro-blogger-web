import { TPeerMetadata } from '@/utils/types'
import { useLocalPeer } from '@huddle01/react/hooks'
import { TMessage } from '.'

interface Props {
  message: TMessage
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<TPeerMetadata>()

  return (
    <div className='flex w-full flex-col items-end rounded-lg bg-white'>
      <span className='text-sm text-white'>{message.text}</span>
    </div>
  )
}

export default LocalMessageBubble
