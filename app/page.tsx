'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VideoUploader from '@/components/video-uploader'
import FrameExtractor from '@/components/frame-extractor'

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleVideoUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
  }, [])

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }, [])

  const handleRemoveVideo = useCallback(() => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc)
    }
    setVideoSrc(null)
    setCurrentTime(0)
    setDuration(0)
    if (videoRef.current) {
      videoRef.current.src = ''
      videoRef.current = null
    }
  }, [videoSrc])

  useEffect(() => {
    if (videoSrc) {
      const video = document.createElement('video')
      video.src = videoSrc
      video.onloadedmetadata = () => {
        setDuration(video.duration)
        videoRef.current = video
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.src = ''
        videoRef.current = null
      }
    }
  }, [videoSrc])

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">视频帧提取器</h1>
      {!videoSrc && <VideoUploader onUpload={handleVideoUpload} />}
      {videoSrc && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">视频帧提取</h2>
                <Button variant="destructive" onClick={handleRemoveVideo}>移除视频</Button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Slider
                  min={0}
                  max={duration}
                  step={0.1}
                  value={[currentTime]}
                  onValueChange={(value) => handleTimeChange(value[0])}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  value={currentTime.toFixed(1)}
                  onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
              <FrameExtractor videoSrc={videoSrc} currentTime={currentTime} />
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}

