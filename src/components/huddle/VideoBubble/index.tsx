export default function VideoBubble({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>
}) {
  return (
    <div className='rounded-xl border-2 border-blue-400'>
      <video
        ref={videoRef}
        className='h-full w-full rounded-xl object-cover'
        autoPlay
        muted
      />
    </div>
  )
}
