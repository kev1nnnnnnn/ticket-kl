import { Worker, Job } from 'bullmq'
import MailService from '#services/MailService'
import { dbWorker } from '#start/kernel-worker'
import { redisClient } from '../start/redis.js' // mesma instância

interface EmailJobData {
  destinatarios: string[]
  subject: string
  message: string
}

const PREFIX = 'bullmq' // MESMO prefixo usado na Queue

const worker = new Worker<EmailJobData>(
  'emails',
  async (job: Job<EmailJobData>) => {
    const { destinatarios, subject, message } = job.data
    const mailService = new MailService()

    for (const email of destinatarios) {
      try {
        await mailService.sendMail({ to: email, subject, html: message })
        await dbWorker('email_logs').insert({
          destinatario: email,
          assunto: subject,
          mensagem: message,
          status: 'enviado',
          data_envio: dbWorker.fn.now(),
          created_at: dbWorker.fn.now(),
          updated_at: dbWorker.fn.now(),
        })
        console.log(`✅ E-mail enviado: ${email}`)
      } catch (error: any) {
        console.error(`Falha: ${email}`, error.message)
        try {
          await dbWorker('email_logs').insert({
            destinatario: email,
            assunto: subject,
            mensagem: message,
            status: 'falhou',
            erro: error.message,
            data_envio: dbWorker.fn.now(),
            created_at: dbWorker.fn.now(),
            updated_at: dbWorker.fn.now(),
          })
        } catch (dbError: any) {
          console.error(' Falha ao registrar log no DB:', dbError.message)
        }
      }
    }
  },
  {
    connection: redisClient,
    prefix: PREFIX, // MESMO prefixo da fila
  }
)

worker.on('completed', (job) => console.log(`Job finalizado: ${job.id}`))
worker.on('failed', (job, err) => console.error(`Job falhou: ${job?.id}`, err?.message))

console.log('Worker de e-mails iniciado e aguardando jobs...')
