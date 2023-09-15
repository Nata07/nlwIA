import fastify from 'fastify'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAICompletionRoute } from './routes/generate-ai-completion'
import { getAlPromptsRoute } from './routes/get-all-prompts'
import { getAllVideosRoute } from './routes/get-all-videos'
import { uploadVideoRoute } from './routes/upload-video'

const app = fastify()

app.register(getAlPromptsRoute)
app.register(uploadVideoRoute)
app.register(getAllVideosRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

app.listen({
  port: 3333
}).then(() => {
  console.log('Server run 🚀')
})