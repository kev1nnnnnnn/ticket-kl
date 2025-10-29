import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Chamado from '../models/chamado.js'
import ComentarioChamado from '../models/comentario_chamado.js'

export default class ChamadosController {
  /**
   * Listar todos os chamados com paginação
   */
  public async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const chamados = await Chamado.query()
      .preload('usuario')
      .preload('tecnico')
      .preload('categoria')
      .preload('comentarios')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

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
      'categoriaId',
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
      'closedAt',
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

  /**
   * Marcar chamado como resolvido
   */
  public async resolvido({ params, auth, response }: HttpContext) {
    const chamado = await Chamado.find(params.id)
    if (!chamado) {
      return response.notFound({ message: 'Chamado não encontrado' })
    }

    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Usuário não logado' })
    }

    chamado.status = 'resolvido'
    chamado.closedAt = DateTime.now()
    await chamado.save()

    await ComentarioChamado.create({
      userId: user.id,
      chamadoId: chamado.id,
      comentario: '[RESOLVIDO]',
    })

    return response.ok(chamado)
  }

  public async filtrar({ request }: HttpContext) {
    const {
      status,
      prioridade,
      userId,
      tecnicoId,
      categoriaId,
      dataInicio,
      dataFim,
      search,
      page = 1,
      limit = 10,
    } = request.only([
      'status',
      'prioridade',
      'userId',
      'tecnicoId',
      'categoriaId',
      'dataInicio',
      'dataFim',
      'search',
      'page',
      'limit',
    ]);

    const query = Chamado.query()
      .preload('usuario')
      .preload('tecnico')
      .preload('categoria')
      .preload('comentarios')
      .orderBy('created_at', 'desc');

    // Aplicar filtros
    if (status) {
      query.where('status', status);
    }

    if (prioridade) {
      query.where('prioridade', prioridade);
    }

    if (userId !== undefined && userId !== null && userId !== '') {
      query.where('user_id', Number(userId));
    }

    if (tecnicoId !== undefined && tecnicoId !== null && tecnicoId !== '') {
      query.where('tecnico_id', Number(tecnicoId));
    }

    if (categoriaId !== undefined && categoriaId !== null && categoriaId !== '') {
      query.where('categoria_id', Number(categoriaId));
    }

    if (dataInicio) {
      query.where('created_at', '>=', dataInicio);
    }

    if (dataFim) {
      query.where('created_at', '<=', dataFim);
    }

    if (search) {
      query.andWhere((q) => {
        q.where('titulo', 'like', `%${search}%`)
        .orWhere('descricao', 'like', `%${search}%`);
      });
    }

    const chamados = await query.paginate(Number(page), Number(limit));
    return chamados;
  }

}
