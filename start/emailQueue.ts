import { Queue } from 'bullmq'
import { redisClient } from '../start/redis.js'

export interface EmailJobData {
  destinatarios: string[]
  subject: string
  message: string
}

// emailQueue.ts
export const emailQueue = new Queue<EmailJobData>('emails', {
  connection: redisClient,
  prefix: 'bullmq', // mesmo que o worker
})
