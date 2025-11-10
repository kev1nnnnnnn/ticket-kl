import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Listar todos os usuários
   */
   public async index({ request }: HttpContext) {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const users = await User.query()
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return users
    }
    

  /**
   * Criar novo usuário
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password', 'tipo'])
    const user = await User.create(data)
    return response.created(user)
    }
  /**
   * Mostrar um usuário específico
   */
  public async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }
    return user
  }

  /**
   * Atualizar usuário
   */
  public async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }

    const data = request.only(['fullName', 'email', 'password', 'tipo'])
    user.merge(data)
    await user.save()
    return user
  }

  /**
   * Deletar usuário
   */
  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }

    await user.delete()
    return response.noContent()
  }

/**
   * Filtrar usuários (nome, email, tipo) com paginação
   */
  public async filtrar({ request }: HttpContext) {
    const {
      fullName,
      email,
      tipo,
      page = 1,
      limit = 10,
    } = request.only(['fullName', 'email', 'tipo', 'page', 'limit'])

    const query = User.query().orderBy('created_at', 'desc')

    if (fullName) {
      query.where('full_name', 'like', `%${fullName}%`)
    }

    if (email) {
      query.where('email', 'like', `%${email}%`)
    }

    if (tipo) {
      query.where('tipo', tipo)
    }

    const users = await query.paginate(Number(page), Number(limit))
    return users
  }







}
