import type { HttpContext } from "@adonisjs/core/http"
import MailService from "#services/MailService"
import EmailLog from "#models/email_log"

export default class EmailsController {
  /**
   * Envia um e-mail e registra o log
   */
  public async enviar({ request, response }: HttpContext) {
    const { to, subject, message } = request.only(["to", "subject", "message"])
    const mailService = new MailService()

    try {
      await mailService.sendMail({
        to,
        subject,
        html: message,
      })

      return response.ok({ message: "E-mail enviado com sucesso!" })
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)
      return response.internalServerError({
        message: "Falha ao enviar e-mail.",
        error: error.message,
      })
    }
  }

  /**
   * Lista todos os logs de e-mails enviados
   */
  public async index({ request }: HttpContext) {
    const page = request.input("page", 1)
    const limit = request.input("limit", 10)

    const logs = await EmailLog.query()
      .orderBy("data_envio", "desc")
      .paginate(page, limit)

    return logs
  }

  /**
   * Mostra um log específico
   */
  public async show({ params, response }: HttpContext) {
    const log = await EmailLog.find(params.id)

    if (!log) {
      return response.notFound({ message: "Log de e-mail não encontrado." })
    }

    return log
  }

  /**
   * Exclui um log específico
   */
  public async destroy({ params, response }: HttpContext) {
    const log = await EmailLog.find(params.id)

    if (!log) {
      return response.notFound({ message: "Log de e-mail não encontrado." })
    }

    await log.delete()
    return response.ok({ message: "Log removido com sucesso." })
  }
}
