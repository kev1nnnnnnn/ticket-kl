import type { HttpContext } from "@adonisjs/core/http"
import MailService from "#services/MailService"

export default class TesteEmailController {
  public async enviar({ request, response }: HttpContext) {
    const { to, subject, message, from } = request.only(["to", "subject", "message", "from"])

    if (!to || !subject || !message) {
      return response.badRequest({ error: "Campos obrigatórios: to, subject e message." })
    }

    const mailService = new MailService()

    await mailService.sendMail({
      to,
      subject,
      html: message, // usa o HTML vindo do frontend
      from,
    })

    return response.ok({ message: `E-mail enviado com sucesso para ${to}` })
  }
}
