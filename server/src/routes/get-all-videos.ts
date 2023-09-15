import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function getAllVideosRoute(app: FastifyInstance) {
  app.get('/videos', async (_, reply) => {
    const video = await prisma.video.findMany()
  
    return reply.send({video})
  })
}