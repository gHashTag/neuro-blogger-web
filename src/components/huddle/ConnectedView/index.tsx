import React, { useState, useRef, useEffect } from 'react'
import {
  useLocalAudio,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
} from '@huddle01/react/hooks'
import {
  Camera,
  MessageCircle,
  Mic,
  MonitorUp,
  MoreHorizontal,
  Phone,
  RepeatIcon as Record,
  Smile,
  Users2,
  Wifi,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ChatBox from '../ChatBox'
import RemotePeer from '../RemotePeer'
import VideoDisplay from '../VideoDisplay'

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
    isAudioOn ? await disableAudio() : await enableAudio()
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
        />
      </div>
    </div>
  )
}

type VideoConferenceProps = {
  isVideoOn: boolean
  toggleVideo: () => void
  isAudioOn: boolean
  toggleAudio: () => void
  isRecording: boolean
  toggleRecording: () => void
}

function VideoConference({
  isVideoOn,
  toggleVideo,
  isAudioOn,
  toggleAudio,
  isRecording,
  toggleRecording,
}: VideoConferenceProps) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

  const { stream } = useLocalVideo()
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLVideoElement>(null)
  const { peerIds } = usePeerIds()
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare()
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className='flex flex-1 flex-col bg-black'>
      <VideoDisplay
        isVideoOn={isVideoOn}
        shareStream={shareStream}
        videoRef={videoRef}
        screenRef={screenRef}
      />

      <div className='flex flex-1 items-center justify-center'>
        <div className='mt-8 grid gap-2 text-center lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left'>
          {peerIds.map(peerId =>
            peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
          )}
        </div>
      </div>

      {/* Control bar */}
      <div className='flex h-16 items-center justify-between gap-2 px-2'>
        <div className='flex items-center gap-2'>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
            onClick={toggleRecording}
          >
            <Record className='h-5 w-5' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
          >
            <MoreHorizontal className='h-5 w-5' />
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
            onClick={toggleVideo}
          >
            <Camera className='h-5 w-5' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
            onClick={toggleAudio}
          >
            <Mic className='h-5 w-5' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
          >
            <Smile className='h-5 w-5' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
          >
            <MonitorUp className='h-5 w-5' />
          </Button>
          <Button size='icon' variant='destructive'>
            <Phone className='h-5 w-5' />
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='ghost' className='text-zinc-400 hover:text-white'>
            <Users2 className='mr-2 h-4 w-4' />
            <span>1/100</span>
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='text-zinc-400 hover:text-white'
            onClick={() => {
              setIsChatOpen(!isChatOpen)
            }}
          >
            <MessageCircle className='h-5 w-5' />
          </Button>
          <Separator orientation='vertical' className='mx-2 h-6' />
          <Button variant='ghost' className='text-zinc-400 hover:text-white'>
            <Wifi className='mr-2 h-4 w-4' />
            <span>Go live</span>
          </Button>
        </div>
        {isChatOpen && <ChatBox />}
      </div>
    </div>
  )
}

export default ConnectedView
