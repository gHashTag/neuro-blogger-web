import React, { useState } from 'react'
import { useLocalAudio, useLocalVideo } from '@huddle01/react/hooks'
import VideoConference from '../VideoConference'

type ConnectedViewProps = {
  roomId: string
}

const ConnectedView: React.FC<ConnectedViewProps> = ({ roomId }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const { enableVideo, isVideoOn, disableVideo } = useLocalVideo()
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio()

  const toggleVideo = async () => {
    isVideoOn ? await disableVideo() : await enableVideo()
  }

  const toggleAudio = async () => {
    if (isAudioOn) {
      console.log('Disabling audio...')
      await disableAudio()
      console.log('Audio disabled.')
    } else {
      console.log('Enabling audio...')
      await enableAudio()
      console.log('Audio enabled.')
    }
  }

  const toggleRecording = async () => {
    const status = isRecording
      ? await fetch(`/api/stopRecording?roomId=${roomId}`)
      : await fetch(`/api/startRecording?roomId=${roomId}`)

    const data = await status.json()
    console.log('📊', { data })
    setIsRecording(!isRecording)
  }

  return (
    <div className='flex h-[80vh] w-[100vw] items-center justify-center'>
      <div className='flex h-[80vh] w-[75vw] flex-col bg-gray-800'>
        <VideoConference
          isVideoOn={isVideoOn}
          toggleVideo={toggleVideo}
          isAudioOn={isAudioOn}
          toggleAudio={toggleAudio}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
          roomId={roomId}
        />
      </div>
    </div>
  )
}

export default ConnectedView
