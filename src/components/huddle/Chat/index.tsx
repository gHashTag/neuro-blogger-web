'use client'
import type React from 'react'
import { useState, useRef } from 'react'
import { BasicIcons } from '@/components/assets/BasicIcons'
import { useDataMessage } from '@huddle01/react/hooks'
import Header from '../Sidebar/Header/Header'
import { useReactiveVar } from '@apollo/client'
import {
  setUserDisplayNameVar,
  setIsChatOpenVar,
  setChatMessagesVar,
} from '@/store/reactive-store'
import useChatScroll from './ChatScroll'

const Chat = () => {
  const userDisplayName = useReactiveVar(setUserDisplayNameVar)
  const [message, setMessage] = useState<string>('')
  const chatMessages = useReactiveVar(setChatMessagesVar)
  const setIsChatOpen = useReactiveVar(setIsChatOpenVar)

  const ref = useChatScroll(chatMessages)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { sendData } = useDataMessage()

  async function handleSend() {
    sendDataToAllPeers()
    const newChatMessage = {
      name: userDisplayName,
      text: message,
      is_user: true,
    }
    setChatMessagesVar([...chatMessages, newChatMessage])
    setMessage('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      buttonRef.current?.click()
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value)
  }

  const sendDataToAllPeers = () => {
    sendData({
      to: '*',
      payload: JSON.stringify({ message: message, name: userDisplayName }),
      label: 'chat',
    })
  }

  const displayChats = chatMessages.map((chat: any, index: any) => {
    return (
      <div
        key={index}
        className={`${
          chat.is_user
            ? 'text-md mb-2 ml-auto flex w-fit max-w-xs items-center break-words rounded-2xl bg-[#216CFC] px-4 py-1'
            : 'text-md mb-2 w-fit max-w-xs break-words rounded-lg bg-[#343744] px-4 py-1'
        }`}
      >
        <div className='text-xs text-blue-300'>
          {chat.is_user ? null : chat.name}
        </div>
        {chat.text}
      </div>
    )
  })

  return (
    <div className='mr-3 h-4/5 w-1/4 rounded-lg bg-[#191B1F] p-2 text-white'>
      <div className='flex h-full flex-col'>
        <Header
          title='Chat'
          icon={BasicIcons.chat}
          onClose={() => setIsChatOpenVar(false)}
        />
        {/* <div className="mb-3 font-mono text-left text-lg p-2">
          <div className="flex items-center gap-2">{BasicIcons.chat}Chat</div>
          <div className="border-t mt-3 border-gray-700"></div>
        </div> */}
        <div ref={ref} className='mt-2 h-full flex-col overflow-auto'>
          <div className='font-sans'>{displayChats}</div>
        </div>
        <div className='flex py-1 pl-1'>
          <input
            type='text'
            placeholder='Type a message'
            className='w-full rounded-lg bg-[#343744] p-2 text-sm'
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button ref={buttonRef} className='p-1' onClick={handleSend}>
            {BasicIcons.send}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
