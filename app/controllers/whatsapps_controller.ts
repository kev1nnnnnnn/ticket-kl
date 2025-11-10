import type { HttpContext } from '@adonisjs/core/http'
import WhatsAppService from '#services/WhatsAppService'

export default class WhatsAppController {

  public async send({ request, response }: HttpContext) {
    const { phone, message } = request.only(['phone', 'message'])

    if (!phone || !message) {
      return response.badRequest({ error: 'Número e mensagem são obrigatórios' })
    }

    try {
      const result = await WhatsAppService.sendText(phone, message)
      return response.ok({ success: true, result })
    } catch (error: any) {
      return response.internalServerError({ error: error.message })
    }
  }
}
