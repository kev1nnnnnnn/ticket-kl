import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/cliente'
import Endereco from '#models/endereco'

export default class ClientesController {

  public async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const clients = await Client.query()
      .preload('enderecos')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return clients
  }


   // Filtrar clientes
  public async filtrar({ request }: HttpContext) {
    const {
      nome,
      email,
      telefone,
      cidade,
      estado,
      page = 1,
      limit = 10,
    } = request.only(['nome', 'email', 'telefone', 'cidade', 'estado', 'page', 'limit'])

    const query = Client.query().preload('enderecos').orderBy('created_at', 'desc')

    if (nome) {
      query.where('nome', 'like', `%${nome}%`)
    }

    if (email) {
      query.where('email', 'like', `%${email}%`)
    }

    if (telefone) {
      query.where('telefone', 'like', `%${telefone}%`)
    }

    if (cidade) {
      query.whereHas('enderecos', (q) => {
        q.where('cidade', 'like', `%${cidade}%`)
      })
    }

    if (estado) {
      query.whereHas('enderecos', (q) => {
        q.where('estado', 'like', `%${estado}%`)
      })
    }

    const clients = await query.paginate(Number(page), Number(limit))
    return clients
  }

  // Cria um novo cliente
  public async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'email', 'telefone'])
    const client = await Client.create(data)
    return response.created(client)
  }

  // Mostra um cliente específico (com endereços)
  public async show({ params, response }: HttpContext) {
    const client = await Client.query().where('id', params.id).preload('enderecos').first()
    if (!client) return response.notFound({ error: 'Cliente não encontrado' })
    return response.ok(client)
  }

  // Atualiza dados do cliente
  public async update({ params, request, response }: HttpContext) {
    const client = await Client.find(params.id)
    if (!client) return response.notFound({ error: 'Cliente não encontrado' })

    const data = request.only(['nome', 'email', 'telefone'])
    client.merge(data)
    await client.save()

    return response.ok(client)
  }

  // Remove cliente (endereços são deletados via CASCADE)
  public async destroy({ params, response }: HttpContext) {
    const client = await Client.find(params.id)
    if (!client) return response.notFound({ error: 'Cliente não encontrado' })

    await client.delete()
    return response.noContent()
  }
}
