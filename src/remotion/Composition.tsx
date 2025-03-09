import {
  AbsoluteFill,
  useVideoConfig,
  OffthreadVideo,
  staticFile,
} from 'remotion'

export const MyComposition = () => {
  const { fps, durationInFrames, width, height } = useVideoConfig()

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 60,
        backgroundColor: '#2d2d2d',
      }}
    >
      <OffthreadVideo src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' />
    </AbsoluteFill>
  )
}
