import type { HttpContext } from '@adonisjs/core/http'
import Chamado from '#models/chamado'

export default class DashboardController {
  public async chamadosPorStatus({ response }: HttpContext) {
    const resultado = await Chamado.porStatus()
    return response.ok(resultado)
  }

  public async chamadosPorPrioridade({ response }: HttpContext) {
    const resultado = await Chamado.porPrioridade()
    return response.ok(resultado)
  }

  public async chamadosUltimos7Dias({ response }: HttpContext) {
    const resultado = await Chamado.ultimosDias(7)
    return response.ok(resultado)
  }

  public async tempoMedioResolucao({ response }: HttpContext) {
    const mediaHoras = await Chamado.tempoMedioResolucao()
    return response.ok({ media_horas: mediaHoras })
  }

  public async resumoGeral({ response }: HttpContext) {
    const [porStatus, porPrioridade, ultimos7, tempoMedio] = await Promise.all([
      Chamado.porStatus(),
      Chamado.porPrioridade(),
      Chamado.ultimosDias(7),
      Chamado.tempoMedioResolucao(),
    ])

    return response.ok({
      porStatus,
      porPrioridade,
      ultimos7,
      tempoMedio: { media_horas: tempoMedio },
    })
  }

  public async index({}: HttpContext) {
    const chamados = await Chamado.todosComRelacionamentos()
    return chamados
  }
}
