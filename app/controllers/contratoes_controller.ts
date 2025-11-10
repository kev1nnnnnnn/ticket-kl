import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '../models/contrato.js'
import Client from '../models/cliente.js'
import { gerarNumeroContrato } from '#services/ContractService'
import { serializeContrato } from '../helpers/serializeContrato.js'
import { gerarPdfContrato } from './gerar_relatorio_pdfs_controller.js'

export default class ContratoesController {
    // 🔹 Listar contratos com paginação
    public async index({ request, response }: HttpContext) {
        const page = Number(request.input('page', 1))
        const limit = Number(request.input('limit', 10))

        const contratos = await Contrato.query()
            .preload('cliente')
            .orderBy('createdAt', 'desc')
            .paginate(page, limit)

        // Serializa todos os contratos para number
        const serializedData = contratos.toJSON().data.map(serializeContrato)

        return response.ok({ ...contratos.toJSON(), data: serializedData })
    }

    // 🔹 Filtrar contratos
    public async filtrar({ request, response }: HttpContext) {
        const {
        numeroContrato,
        clienteNome,
        ativo,
        page = 1,
        limit = 10,
        } = request.only([
        'numeroContrato',
        'clienteNome',
        'ativo',
        'page',
        'limit',
        ])

        const query = Contrato.query().preload('cliente').orderBy('createdAt', 'desc')

        if (numeroContrato) {
        query.where('numeroContrato', 'like', `%${numeroContrato}%`)
        }

        if (clienteNome) {
        query.whereHas('cliente', (q) => {
            q.where('nome', 'like', `%${clienteNome}%`)
        })
        }

        if (ativo !== undefined) {
        query.where('ativo', ativo)
        }

        const contratos = await query.paginate(Number(page), Number(limit))
        const serializedData = contratos.toJSON().data.map(serializeContrato)
        return response.ok({ ...contratos.toJSON(), data: serializedData })
    }

    // 🔹 Criar contrato
    public async store({ request, response }: HttpContext) {
        const data = request.only([
            'clienteId',
            'dataInicio',
            'dataFim',
            'valorTotal',
            'ativo',
        ])

        const cliente = await Client.query()
            .where('id', data.clienteId)
            .preload('enderecos')
            .first()

        if (!cliente) return response.notFound({ error: 'Cliente não encontrado' })

        const numeroContrato = await gerarNumeroContrato()
        const contrato = await Contrato.create({ ...data, numeroContrato })

        // Gera PDF e salva a URL
        contrato.pdfUrl = await gerarPdfContrato(contrato, cliente)
        await contrato.save()

        return response.created(serializeContrato(contrato))
    }

    // 🔹 Atualizar contrato
    public async update({ params, request, response }: HttpContext) {
        const contrato = await Contrato.find(params.id)
        if (!contrato) return response.notFound({ error: 'Contrato não encontrado' })

        const data = request.only([
        'clienteId',
        'numeroContrato',
        'dataInicio',
        'dataFim',
        'valorTotal',
        'ativo',
        ])

        // Opcional: verificar cliente se clienteId foi alterado
        if (data.clienteId && data.clienteId !== contrato.clienteId) {
        const cliente = await Client.find(data.clienteId)
        if (!cliente) {
            return response.notFound({ error: 'Cliente não encontrado' })
        }
        }

        contrato.merge(data)
        await contrato.save()

        return response.ok(serializeContrato(contrato))
    }

    // 🔹 Mostrar contrato específico
    public async show({ params, response }: HttpContext) {
        const contrato = await Contrato.query()
            .where('id', params.id)
            .preload('cliente')
            .first()

        if (!contrato) {
            return response.notFound({ error: 'Contrato não encontrado' })
        }

        return response.ok(serializeContrato(contrato))
    }


    // 🔹 Deletar contrato
    public async destroy({ params, response }: HttpContext) {
        const contrato = await Contrato.find(params.id)
        if (!contrato) return response.notFound({ error: 'Contrato não encontrado' })

        await contrato.delete()
        return response.noContent()
    }


 





    
}
