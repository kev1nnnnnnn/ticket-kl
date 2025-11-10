import nodemailer, { Transporter } from "nodemailer"
import EmailLog from "#models/email_log"
import { DateTime } from "luxon"

interface SendMailOptions {
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
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  public async sendMail({ to, subject, html, text, from }: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: from || `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to,
        subject,
        text,
        html,
      })

      // 🔹 Log de sucesso
      await EmailLog.create({
        destinatario: to,
        assunto: subject,
        mensagem: html || text || "",
        status: "enviado",
        dataEnvio: DateTime.now(),
      })
    } catch (error) {
      // 🔹 Log de erro
      await EmailLog.create({
        destinatario: to,
        assunto: subject,
        mensagem: html || text || "",
        status: "falhou",
        erro: error.message,
        dataEnvio: DateTime.now(),
      })

      throw error
    }
  }
}
