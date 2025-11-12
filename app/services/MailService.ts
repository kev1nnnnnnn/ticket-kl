import nodemailer, { Transporter } from 'nodemailer'
import { dbWorker } from '#start/kernel-worker'
import dotenv from 'dotenv'

dotenv.config()

export interface SendMailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
}

export default class MailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    })
  }

  public async sendMail({ to, subject, html, text, from }: SendMailOptions) {
    try {
      // Envia e-mail
      await this.transporter.sendMail({
        from: from || `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to,
        subject,
        text,
        html,
      })

      // Registra sucesso no DB usando knex
      await dbWorker('email_logs').insert({
        destinatario: to,
        assunto: subject,
        mensagem: html || text || '',
        status: 'enviado',
        data_envio: dbWorker.fn.now(),
        created_at: dbWorker.fn.now(),
        updated_at: dbWorker.fn.now(),
      })

      console.log(`✅ E-mail enviado: ${to}`)
    } catch (error: any) {
      console.error(`Falha ao enviar e-mail para ${to}:`, error.message)

      // Registra falha no DB
      try {
        await dbWorker('email_logs').insert({
          destinatario: to,
          assunto: subject,
          mensagem: html || text || '',
          status: 'falhou',
          erro: error.message,
          data_envio: dbWorker.fn.now(),
          created_at: dbWorker.fn.now(),
          updated_at: dbWorker.fn.now(),
        })
      } catch (dbError) {
        console.error(' Falha ao registrar log de erro no DB:', dbError)
      }

      throw error
    }
  }
}
