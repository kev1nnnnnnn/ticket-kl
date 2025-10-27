import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Listar todos os usuários
   */
  public async index({}: HttpContext) {
    const users = await User.all()
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
}
