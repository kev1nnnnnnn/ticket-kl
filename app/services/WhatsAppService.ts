import axios from 'axios'

export default class WhatsAppService {
  private static readonly BASE_URL = 'https://graph.facebook.com/v22.0'
  
  // Substitua pelo PHONE_NUMBER_ID da sua conta de produção
  private static readonly PHONE_NUMBER_ID = '920468861140131'

  // Substitua pelo TOKEN de longa duração (long-lived token) da produção
  private static readonly TOKEN = 'EAATdsuYdbLMBPw2kmdlKM0opzfeVLwZAz5qJybWPQ7W2kayhZBP7WZAPbyitZCO3ys8p1y5ZAhSPRQMsF0ZBZCAebNyhJI3ZBbo6euHg05d02SxocavGrvCPb3LlSZBzjetagS6yDdiN5DKkeXCoeol3PmCnQMlTZB0wQBI5Ry5kfZCMiKLMhg6H36EMaL4N1Hyz7ost01VW2VvrNB8NvD59SNIltjydeGMUghGaw1e9ke0XObSxK9AZA1UIhgZAz52M5e4koXWzvrjrIx05tT1If5RUY'

  /**
   * Envia mensagem de texto livre
   */
  static async sendText(to: string, message: string) {
    if (!to || !/^\d{10,15}$/.test(to)) {
      throw new Error('Número inválido. Use formato internacional sem +, ex: 5511999998888')
    }

    try {
      const response = await axios.post(
        `${this.BASE_URL}/${this.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error.response?.data || error.message)
      throw new Error('Falha ao enviar WhatsApp')
    }
  }
}
