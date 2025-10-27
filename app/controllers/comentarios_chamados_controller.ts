import type { HttpContext } from '@adonisjs/core/http'
import ComentarioChamado from '../models/comentario_chamado.js'

interface ComentarioData {
  userId: number
  comentario: string
  chamadoId: number
}

export default class ComentariosChamadoController {

  /**
   * Listar todos os comentários de um chamado específico
   */
  public async index({ params, response }: HttpContext) {
    if (!params.chamadoId) {
      return response.badRequest({ message: 'chamadoId é obrigatório' })
    }

    const comentarios = await ComentarioChamado.query()
      .where('chamado_id', Number(params.chamadoId))
      .preload('usuario')

    return comentarios
  }

  /**
   * Criar novo comentário
   */
  public async store({ params, request, response, auth }: HttpContext) {
    if (!params.chamadoId) {
      return response.badRequest({ message: 'chamadoId é obrigatório' })
    }

    // Pega o usuário logado
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Usuário não logado' })
    }

    const body = request.only(['comentario'])
    const data: ComentarioData = {
      userId: user.id, // USUÁRIO LOGADO
      comentario: body.comentario,
      chamadoId: Number(params.chamadoId),
    }

    const comentario = await ComentarioChamado.create(data)
    await comentario.preload('usuario') // para já vir com usuário
    return response.created(comentario)
  }

  /**
   * Mostrar um comentário específico
   */
  public async show({ params, response }: HttpContext) {
    const comentario = await ComentarioChamado.find(params.id)
    if (!comentario) {
      return response.notFound({ message: 'Comentário não encontrado' })
    }
    return comentario
  }

  /**
   * Atualizar comentário
   */
  public async update({ params, request, response }: HttpContext) {
    const comentario = await ComentarioChamado.find(params.id)
    if (!comentario) {
      return response.notFound({ message: 'Comentário não encontrado' })
    }

    const body = request.only(['comentario'])
    comentario.merge({ comentario: body.comentario })
    await comentario.save()
    return comentario
  }

  /**
   * Deletar comentário
   */
  public async destroy({ params, response }: HttpContext) {
    const comentario = await ComentarioChamado.find(params.id)
    if (!comentario) {
      return response.notFound({ message: 'Comentário não encontrado' })
    }

    await comentario.delete()
    return response.noContent()
  }
}
