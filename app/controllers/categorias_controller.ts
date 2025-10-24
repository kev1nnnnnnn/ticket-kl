import type { HttpContext } from '@adonisjs/core/http'
import Categoria from '../models/categoria.js'

export default class CategoriasController {
  /**
   * Listar todas as categorias
   */
  public async index({}: HttpContext) {
    const categorias = await Categoria.all()
    return categorias
  }

  /**
   * Criar nova categoria
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'descricao'])
    const categoria = await Categoria.create(data)
    return response.created(categoria)
  }

  /**
   * Mostrar uma categoria específica
   */
  public async show({ params, response }: HttpContext) {
    const categoria = await Categoria.find(params.id)
    if (!categoria) {
      return response.notFound({ message: 'Categoria não encontrada' })
    }
    return categoria
  }

  /**
   * Atualizar categoria
   */
  public async update({ params, request, response }: HttpContext) {
    const categoria = await Categoria.find(params.id)
    if (!categoria) {
      return response.notFound({ message: 'Categoria não encontrada' })
    }

    const data = request.only(['nome', 'descricao'])
    categoria.merge(data)
    await categoria.save()
    return categoria
  }

  /**
   * Deletar categoria
   */
  public async destroy({ params, response }: HttpContext) {
    const categoria = await Categoria.find(params.id)
    if (!categoria) {
      return response.notFound({ message: 'Categoria não encontrada' })
    }

    await categoria.delete()
    return response.noContent()
  }
}
