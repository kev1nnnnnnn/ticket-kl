import type { HttpContext } from '@adonisjs/core/http'
import { loginSchema } from '#validators/login_validator'
import User from '#models/user'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const fieldErrors = []

      // 1 - Campos vazios
      if (!data.email || data.email.trim() === '') {
        fieldErrors.push({ field: 'email', message: 'O e-mail é obrigatório' })
      }
      if (!data.password || data.password.trim() === '') {
        fieldErrors.push({ field: 'password', message: 'A senha é obrigatória' })
      }

      if (fieldErrors.length > 0) {
        return response.badRequest({
          message: 'Erro de validação',
          errors: fieldErrors,
        })
      }

      // 2️ - Validação de formato e tamanho
      const { email, password } = await loginSchema.validate(data)

      // 3️ - Busca usuário
      const user = await User.query().where('email', email).first()
      if (!user) {
        return response.unauthorized({
          message: 'Erro de validação',
          errors: [{ field: 'password', message: 'Login ou senha inválida' }],
        })
      }

      // 4️ - Verifica senha
      try {
        await User.verifyCredentials(email, password)
      } catch (err: any) {
        // Senha incorreta
        return response.unauthorized({
          message: 'Erro de validação',
          errors: [{ field: 'password', message: 'Senha incorreta' }],
        })
      }

      // 5️ - Cria token
      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login realizado com sucesso!',
        token: token.value?.release(),
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch (error: any) {
      // 6️ - Erros de validação do Vine
      if (error?.messages && typeof error.messages === 'object') {
        const customErrors = Object.entries(error.messages).map(([field, msgs]) => {
          const messagesArray = Array.isArray(msgs) ? msgs : [String(msgs)]
          return { field, message: messagesArray[0] }
        })

        return response.badRequest({
          message: 'Erro de validação',
          errors: customErrors,
        })
      }

      // 7️ - Outros erros inesperados
      return response.internalServerError({
        message: 'Erro interno ao realizar login',
        error: error?.message || String(error),
      })
    }
  }

  public async me({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      return response.ok({ user })
    } catch (error: any) {
      return response.unauthorized({
        message: 'Não autenticado',
        errors: [{ field: 'auth', message: error?.message }],
      })
    }
  }
}
