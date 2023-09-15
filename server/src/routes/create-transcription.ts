import { FastifyInstance } from "fastify";
import { createReadStream } from "fs";
import { z } from 'zod';
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/video/:videoId/transcription', async (req, reply) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    })
    const bodySchema = z.object({
      prompt: z.string(),
    })

    const { videoId }= paramsSchema.parse(req.params)
    const { prompt } = bodySchema.parse(req.body)
    
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      }
    })
    const videoPath = video.path;

    const audio = createReadStream(videoPath);

    const response = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt
    })
    
    await prisma.video.update({
      where: {
        id: videoId
      },
      data: {
        transcription: response.text,
      }
    })
    
    return response.text
  })
}