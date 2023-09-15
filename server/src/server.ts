import fastify from 'fastify'
import { getAlPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'

const app = fastify()

app.register(getAlPromptsRoute)
app.register(uploadVideoRoute)

app.listen({
  port: 3333
}).then(() => {
  console.log('Server run 🚀')
})