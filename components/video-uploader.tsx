import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"

interface VideoUploaderProps {
  onUpload: (file: File) => void
}

export default function VideoUploader({ onUpload }: VideoUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0])
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: false
  })

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>将视频文件拖放到此处...</p>
      ) : (
        <div>
          <p>将视频文件拖放到此处，或点击选择文件</p>
          <Button className="mt-4">选择视频文件</Button>
        </div>
      )}
    </div>
  )
}

