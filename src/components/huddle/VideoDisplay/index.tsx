import React, { useState, useEffect, RefObject } from 'react'
// @ts-ignore
import BubbleUI from 'react-bubble-ui'
import 'react-bubble-ui/dist/index.css'
import { ChildComponent } from './ChildComponent'
import { data } from './data'
import './styles.css'

type VideoDisplayProps = {
  isVideoOn: boolean
  shareStream: MediaStream | null
  videoRef: RefObject<HTMLVideoElement>
  screenRef: RefObject<HTMLVideoElement>
}

export default function VideoDisplay({
  isVideoOn,
  shareStream,
  videoRef,
  screenRef,
}: VideoDisplayProps) {
  // const [bubble, setBubble] = useState('')
  const options = {
    size: 212,
    minSize: 40,
    gutter: 8,
    provideProps: true,
    numCols: 5,
    fringeWidth: 160,
    yRadius: 130,
    xRadius: 220,
    cornerRadius: 50,
    showGuides: false,
    compact: true,
    gravitation: 5,
  }

  useEffect(() => {
    const bubbles = document.querySelector('._2MD0k') as HTMLElement | null
    const img = document.querySelectorAll(
      '.childComponent'
    ) as NodeListOf<HTMLElement>
    img.forEach(
      i =>
        (i.ondragstart = () => {
          return false
        })
    )
    const dragspeed = 2
    let isDown = false
    let startX: number
    let startY: number
    let scrollLeft: number
    let scrollTop: number

    if (bubbles) {
      bubbles.addEventListener('mousedown', (e: MouseEvent) => {
        isDown = true
        bubbles.classList.add('active')
        startX = e.pageX - bubbles.offsetLeft
        startY = e.pageY - bubbles.offsetTop
        scrollLeft = bubbles.scrollLeft
        scrollTop = bubbles.scrollTop
      })
      bubbles.addEventListener('mouseleave', () => {
        isDown = false
        bubbles.classList.remove('active')
      })
      bubbles.addEventListener('mouseup', () => {
        isDown = false
        bubbles.classList.remove('active')
      })
      bubbles.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - bubbles.offsetLeft
        const y = e.pageY - bubbles.offsetTop
        const walk = (x - startX) * dragspeed
        const topwalk = (y - startY) * dragspeed
        bubbles.scrollLeft = scrollLeft - walk
        bubbles.scrollTop = scrollTop - topwalk
      })
    }
  }, [])

  const children = data?.map((data, i) => {
    return <ChildComponent data={data} className='child' key={i} />
  })

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {/* <div style={{ marginRight: 20 }}>{bubble}</div> */}
      <BubbleUI key={1} options={options} className='myBubbleUI'>
        {children}
      </BubbleUI>
    </div>
  )
}
