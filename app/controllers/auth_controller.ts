import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  /**
   * Realiza login e retorna o token de acesso
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Usa o AuthFinder do seu model para autenticar
      const user = await User.verifyCredentials(email, password)

      //  Cria o token de acesso
      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login realizado com sucesso!',
        token: token.value?.release(), // o valor puro do token
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch {
      return response.unauthorized({ message: 'Credenciais inválidas' })
    }
  }

  /**
   * Retorna o usuário autenticado (rota protegida)
   */
  async me({ auth, response }: HttpContext) {
    const user = await auth.use('api').authenticate()
    return response.ok({ user })
  }
}
