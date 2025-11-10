import type { HttpContext } from '@adonisjs/core/http'
import Endereco from '#models/endereco'
import axios from 'axios'

export default class EnderecosController {
  // 🔹 Lista todos os endereços
  public async index({ response }: HttpContext) {
    const enderecos = await Endereco.query().preload('cliente')
    return response.ok(enderecos)
  }

  // 🔹 Cria endereço vinculado a um cliente
  public async store({ request, response }: HttpContext) {
    const data = request.only(['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep', 'cliente_id'])
    const endereco = await Endereco.create(data)
    return response.created(endereco)
  }

  // 🔹 Mostra um endereço
  public async show({ params, response }: HttpContext) {
    const endereco = await Endereco.query().where('id', params.id).preload('cliente').first()
    if (!endereco) return response.notFound({ error: 'Endereço não encontrado' })
    return response.ok(endereco)
  }

  // 🔹 Atualiza um endereço
  public async update({ params, request, response }: HttpContext) {
    const endereco = await Endereco.find(params.id)
    if (!endereco) return response.notFound({ error: 'Endereço não encontrado' })

    const data = request.only(['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'])
    endereco.merge(data)
    await endereco.save()

    return response.ok(endereco)
  }

  // 🔹 Deleta um endereço
  public async destroy({ params, response }: HttpContext) {
    const endereco = await Endereco.find(params.id)
    if (!endereco) return response.notFound({ error: 'Endereço não encontrado' })

    await endereco.delete()
    return response.noContent()
  }

 public async buscarCep({ request, response }: HttpContext) {
  const cep = request.input('cep'); // pega do query string: /enderecos/cep?cep=69050000

  if (!cep) {
    return response.badRequest({ error: 'CEP é obrigatório' })
  }

  try {
    const sanitizedCep = cep.replace(/\D/g, '')
    const viacepResponse = await axios.get(`https://viacep.com.br/ws/${sanitizedCep}/json/`)

    if (viacepResponse.data.erro) {
      return response.notFound({ error: 'CEP não encontrado' })
    }

    return response.ok({
      rua: viacepResponse.data.logradouro,
      bairro: viacepResponse.data.bairro,
      cidade: viacepResponse.data.localidade,
      estado: viacepResponse.data.uf,
    })
  } catch (error) {
    console.error(error)
    return response.internalServerError({ error: 'Erro ao buscar CEP' })
  }
}







}
