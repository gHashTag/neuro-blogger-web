'use client'

import React, { useState } from 'react'

import Strip from '../Sidebar/Peers/PeerRole/Strip'
import { useReactiveVar } from '@apollo/client'
import {
  setSidebarViewVar,
  setIsChatOpenVar,
  setPromptViewVar,
} from '@/store/reactive-store'
// Assets
import { BasicIcons, NestedBasicIcons } from '@/components/assets/BasicIcons'
import { cn, getFallbackAvatar } from '@/lib/utils'
import Dropdown from '../common/Dropdown'
import EmojiTray from '../EmojiTray/EmojiTray'
import {
  useLocalPeer,
  useLocalAudio,
  usePeerIds,
  useRoom,
  useLocalScreenShare,
} from '@huddle01/react/hooks'
import toast from 'react-hot-toast'
import { NestedPeerListIcons } from '@/components/assets/PeerListIcons'
import { Button } from '@/components/ui/button'
import { MonitorOff, MonitorUp } from 'lucide-react'

type BottomBarProps = {}

const BottomBar: React.FC<BottomBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSharing, setIsSharing] = useState<boolean>(false)
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare()
  const { peerIds } = usePeerIds()

  const { leaveRoom, closeRoom } = useRoom()

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio({
    onProduceStart(producer) {
      toast.success('Producer created')
      console.debug('Producer created', producer)
    },
  })

  const sidebarView = useReactiveVar(setSidebarViewVar)
  const isChatOpen = useReactiveVar(setIsChatOpenVar)

  const {
    role,
    metadata,
    peerId,
    updateMetadata,
    updateRole,
    peerId: localPeerId,
  } = useLocalPeer<{
    displayName: string
    avatarUrl: string
    isHandRaised: boolean
  }>()

  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false)

  const toggleScreenShare = async () => {
    if (isSharing) {
      await stopScreenShare()
    } else {
      await startScreenShare()
    }
    setIsSharing(!isSharing)
  }

  return (
    <div className='absolute bottom-6 flex w-full items-center justify-between px-10'>
      {/* Bottom Bar Left */}
      <div>
        {role === 'host' || role === 'coHost' || role === 'speaker' ? (
          <div className='mr-auto flex w-44 items-center justify-between gap-3' />
        ) : (
          <OutlineButton
            className='mr-auto flex items-center justify-between gap-3'
            onClick={() => setPromptViewVar('request-to-speak')}
          >
            {BasicIcons.requestToSpeak}
            <div>Request to speak</div>
          </OutlineButton>
        )}
      </div>

      {/* Bottom Bar Center */}
      <div className='flex items-center gap-4'>
        {role !== 'listener' &&
          (!isAudioOn ? (
            <button
              onClick={() => {
                enableAudio()
              }}
            >
              {NestedBasicIcons.inactive.mic}
            </button>
          ) : (
            <button
              onClick={() => {
                disableAudio()
              }}
            >
              {NestedBasicIcons.active.mic}
            </button>
          ))}
        <Button
          size='icon'
          variant='ghost'
          className='text-zinc-400 hover:text-white'
          onClick={toggleScreenShare}
        >
          {isSharing ? (
            <MonitorOff className='h-5 w-5' />
          ) : (
            <MonitorUp className='h-5 w-5' />
          )}
        </Button>
        <Dropdown
          triggerChild={BasicIcons.avatar}
          open={isOpen}
          onOpenChange={() => setIsOpen(prev => !prev)}
        >
          <EmojiTray
            onClick={() => alert('todo')}
            onClose={() => setIsOpen(false)}
          />
        </Dropdown>
        <button
          className='bg-custom-3 border-custom-4 z-10 rounded-lg p-[11px]'
          onClick={() => {
            if (peerId === localPeerId) {
              updateMetadata({
                displayName: metadata?.displayName ?? 'Guest',
                avatarUrl: metadata?.avatarUrl ?? getFallbackAvatar(),
                isHandRaised: !metadata?.isHandRaised,
              })
            }
          }}
        >
          {metadata?.isHandRaised
            ? NestedPeerListIcons.active.hand
            : NestedPeerListIcons.inactive.hand}
        </button>
        <Dropdown
          triggerChild={BasicIcons.leave}
          open={showLeaveDropDown}
          onOpenChange={() => setShowLeaveDropDown(prev => !prev)}
        >
          {role === 'host' && (
            <Strip
              type='close'
              title='End spaces for all'
              variant='danger'
              onClick={() => {
                closeRoom()
              }}
            />
          )}
          <Strip
            type='leave'
            title='Leave the space'
            variant='danger'
            onClick={() => {
              leaveRoom()
            }}
          />
        </Dropdown>
      </div>
      <div className='flex items-center gap-4'>
        {/* Bottom Bar Right */}

        <OutlineButton
          className='ml-auto flex items-center gap-3'
          onClick={() => {
            setSidebarViewVar(sidebarView === 'peers' ? 'close' : 'peers')
            if (isChatOpen) {
              setIsChatOpenVar(false)
            }
          }}
        >
          {BasicIcons.peers}
          <span>
            {Object.keys(peerIds).filter(peerId => peerId !== localPeerId)
              .length + 1}
          </span>
        </OutlineButton>
        <OutlineButton
          className='ml-auto flex items-center gap-3'
          onClick={() => {
            setIsChatOpenVar(!isChatOpen)
            if (sidebarView !== 'close') {
              setSidebarViewVar('close')
            }
          }}
        >
          {BasicIcons.chat}
        </OutlineButton>
      </div>
    </div>
  )
}
export default React.memo(BottomBar)

interface OutlineButtonProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  className,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    type='button'
    className={cn('border-custom-4 rounded-lg border px-3 py-2', className)}
  >
    {children}
  </button>
)
