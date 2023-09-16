import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

import { OpenAIStream, streamToResponse } from 'ai';

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (req, reply) => {

    const bodySchema = z.object({
      prompt: z.string(),
      videoId: z.string().uuid(),
      temperature: z.number().max(1).min(0).default(0.0),
    })

    const {videoId, prompt, temperature} = bodySchema.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      }
    })

    if(!video.transcription) {
      return reply.status(400).send({ error: 'Video transcription was nor generated yet.' })
    }

    console.log(prompt)

    const propMessage = prompt.replace('{transcription}', video.transcription)
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        { role: 'user', content: propMessage }
      ],
      stream: true,
    })

    const stream = OpenAIStream(response)
    
    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      }
    })
  })
}