import { api } from "@/lib/axios";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { FileVideo, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type Status = 'waiting' | 'converting' | 'uploading' | 'generated' | 'success'
const statusMessages = {
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generated: 'Transcrevendo...',
  success: 'Sucesso...',
}

interface InputVideoFormProps {
  onChangeVideoId: (id: string) => void
}

export function VideoInputForm({ onChangeVideoId }: InputVideoFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const propInputRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<Status>('waiting')
  
  async function convertVideoToAudio(video: File) {
    console.log('CONVERT STARTER')
    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', log => {
    //   console.log(log)
    // })

    ffmpeg.on('progress', progress => {
      console.log('convert progress ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-codec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], {type: 'audio/mpeg'})
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/,peg'
    })

    console.log('convert finish')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    setStatus('converting')
    event.preventDefault();
    
    const prompt = propInputRef.current?.value
    
    if(!videoFile) {
      return
    }
    
    setStatus('uploading')
    
    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData();

    data.append('file', audioFile)

    const response = await api.post('/videos', data)

    const videoId = response.data.video.id

    setStatus('generated')
    
    await api.post(`/video/${videoId}/transcription`, {
      prompt,
    })
    
    setStatus('success')
    console.log('chamou o onChange')
    console.log(onChangeVideoId)
    onChangeVideoId(videoId)
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const {files} = event.currentTarget
    
    if(!files) {
      return
    }
    
    const selectedFile = files[0]
    
    setVideoFile(selectedFile)
  }
  
  const previewUrl = useMemo(() => {
    if(!videoFile) {
      return ''
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label 
        htmlFor="video" 
        className="text-sm gap-2 border flex flex-col text-muted-foreground rounded-md aspect-video items-center justify-center hover:bg-primary/20"
      >
        {videoFile ? (
          <video 
            className="pointer-events-none w-full h-full" 
            src={previewUrl} 
            controls={false}
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um Video 
          </>
        )}
      </label>
      <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea 
          disabled={status !== 'waiting'}
          ref={propInputRef}
          id="transcription_prompt" 
          className="leading-relaxed h-24 resize-none"
          placeholder="Inclua palavras chaves mencionadas no video separadas por virgula (,)" 
        />
      </div>
      <Button disabled={status !== 'waiting'} type="submit" className="w-full">
        {status === 'waiting' ? (
          <>
            Carregar Video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : statusMessages[status]}
      </Button>
    </form>
  )
}