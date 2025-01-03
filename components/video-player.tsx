import { forwardRef, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

interface VideoPlayerProps {
  src: string
  onTimeUpdate: (time: number) => void
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ src, onTimeUpdate }, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElement = ref || internalRef
    if ((videoElement as RefObject<HTMLVideoElement>).current) {
      (videoElement as RefObject<HTMLVideoElement>).current?.addEventListener('timeupdate', () => {
        onTimeUpdate((videoElement as RefObject<HTMLVideoElement>).current!.currentTime)
      })
    }
  }, [ref, onTimeUpdate])

  return (
    <video
      ref={ref || internalRef}
      src={src}
      controls
      className="w-full max-h-[50vh] object-contain"
    />
  )
})

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer

