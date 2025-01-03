import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"

interface FrameExtractorProps {
  videoSrc: string
  currentTime: number
}

export default function FrameExtractor({ videoSrc, currentTime }: FrameExtractorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFrameReady, setIsFrameReady] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(16 / 9) // 默认宽高比

  const extractFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setIsFrameReady(true)
      }
    }
  }, [])

  const resizeCanvas = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const canvasWidth = Math.min(containerWidth, 1280) // 设置最大宽度为1280px
      const canvasHeight = canvasWidth / aspectRatio

      canvasRef.current.width = canvasWidth
      canvasRef.current.height = canvasHeight
    }
  }, [aspectRatio])

  useEffect(() => {
    const video = document.createElement('video')
    video.src = videoSrc
    video.crossOrigin = 'anonymous'
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    videoRef.current = video

    const handleLoadedMetadata = () => {
      const videoAspectRatio = video.videoWidth / video.videoHeight
      setAspectRatio(videoAspectRatio)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    const updateFrame = () => {
      if (video.readyState >= 2) {
        video.currentTime = currentTime
      }
      requestAnimationFrame(updateFrame)
    }

    video.addEventListener('loadeddata', () => {
      requestAnimationFrame(updateFrame)
    })

    video.addEventListener('seeked', extractFrame)

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', () => {})
      video.removeEventListener('seeked', extractFrame)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [videoSrc, currentTime, extractFrame, resizeCanvas])

  useEffect(() => {
    resizeCanvas()
  }, [aspectRatio, resizeCanvas])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/jpeg')
      link.download = `frame_${currentTime.toFixed(2)}.jpg`
      link.click()
    }
  }, [currentTime])

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="w-full h-auto" />
      {isFrameReady && (
        <Button onClick={handleDownload} className="mt-2">下载图片</Button>
      )}
    </div>
  )
}

