import type { HttpContext } from '@adonisjs/core/http'
import Chamado from '#models/chamado';

export default class AssumesController {

    /**
 * Técnico assume o chamado
 */
public async assumir({ params, auth, response }: HttpContext) {
  const chamado = await Chamado.find(params.id)
  if (!chamado) {
    return response.notFound({ message: 'Chamado não encontrado' })
  }

  const tecnico = auth.user
  if (!tecnico) {
    return response.unauthorized({ message: 'Usuário não autenticado' })
  }

  chamado.tecnicoId = tecnico.id
  chamado.status = 'em_progresso'
  await chamado.save()

  return response.ok(chamado)
}

}