import type { HttpContext } from '@adonisjs/core/http'
import Chamado from '../models/chamado.js'

export default class ChamadosController {
  
  /**
   * Listar todos os chamados
   */
  public async index({}: HttpContext) {
    const chamados = await Chamado.query()
      .preload('usuario')      // Carrega dados do usuário que abriu
      .preload('tecnico')      // Carrega dados do técnico
      .preload('categoria')    // Carrega categoria
      .preload('comentarios')  // Carrega comentários
    return chamados
  }

  /**
   * Criar novo chamado
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only([
      'titulo',
      'descricao',
      'status',
      'prioridade',
      'userId',
      'tecnicoId',
      'categoriaId'
    ])

    const chamado = await Chamado.create(data)
    return response.created(chamado)
  }

  /**
   * Mostrar um chamado específico
   */
  public async show({ params, response }: HttpContext) {
    const chamado = await Chamado.query()
      .where('id', params.id)
      .preload('usuario')
      .preload('tecnico')
      .preload('categoria')
      .preload('comentarios')
      .first()

    if (!chamado) {
      return response.notFound({ message: 'Chamado não encontrado' })
    }
    return chamado
  }

  /**
   * Atualizar chamado
   */
  public async update({ params, request, response }: HttpContext) {
    const chamado = await Chamado.find(params.id)
    if (!chamado) {
      return response.notFound({ message: 'Chamado não encontrado' })
    }

    const data = request.only([
      'titulo',
      'descricao',
      'status',
      'prioridade',
      'tecnicoId',
      'categoriaId',
      'closedAt'
    ])
    chamado.merge(data)
    await chamado.save()
    return chamado
  }

  /**
   * Deletar chamado
   */
  public async destroy({ params, response }: HttpContext) {
    const chamado = await Chamado.find(params.id)
    if (!chamado) {
      return response.notFound({ message: 'Chamado não encontrado' })
    }

    await chamado.delete()
    return response.noContent()
  }
}
