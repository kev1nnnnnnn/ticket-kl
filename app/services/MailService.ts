import nodemailer, { Transporter } from "nodemailer"

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
      secure: process.env.MAIL_SECURE === "true", // true = 465, false = 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  public async sendMail({ to, subject, html, text, from }: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: from || `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text,
      html,
    })
  }
}
