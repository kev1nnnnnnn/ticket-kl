// app/controllers/ordem_de_servicos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import OrdemDeServico from '#models/ordem_de_servico'

export default class OrdemDeServicosController {
    /**
     * Lista todas as OS com paginação
     */
    public async index({ request }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)

        const ordens = await OrdemDeServico.query()
        .preload('cliente')
        .preload('tecnico')
        .preload('chamado')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

        return ordens
    }

    /**
     *  Filtro de OS (por cliente, técnico, status, tipo, datas)
     */
    public async filtrar({ request }: HttpContext) {
        const {
        clienteId,
        tecnicoId,
        chamadoId,
        status,
        tipoAtendimento,
        dataInicio,
        dataFim,
        page = 1,
        limit = 10,
        } = request.only([
        'clienteId',
        'tecnicoId',
        'chamadoId',
        'status',
        'tipoAtendimento',
        'dataInicio',
        'dataFim',
        'page',
        'limit',
        ])

        const query = OrdemDeServico.query()
        .preload('cliente')
        .preload('tecnico')
        .preload('chamado')
        .orderBy('created_at', 'desc')

        if (clienteId) query.where('cliente_id', clienteId)
        if (tecnicoId) query.where('tecnico_id', tecnicoId)
        if (chamadoId) query.where('chamado_id', chamadoId)
        if (status) query.where('status', 'like', `%${status}%`)
        if (tipoAtendimento) query.where('tipo_atendimento', 'like', `%${tipoAtendimento}%`)

        if (dataInicio && dataFim) {
        query.whereBetween('data_abertura', [dataInicio, dataFim])
        }

        const ordens = await query.paginate(Number(page), Number(limit))
        return ordens
    }

    /**
     *  Cria nova OS
     */
    public async store({ request, response }: HttpContext) {
        const data = request.only([
        'chamadoId',
        'clienteId',
        'tecnicoId',
        'descricaoProblema',
        'descricaoSolucao',
        'status',
        'tipoAtendimento',
        'dataAbertura',
        'dataFechamento',
        'tempoGastoHoras',
        'valorServico',
        'materiaisUtilizados',
        'observacoesTecnico',
        'assinaturaCliente',
        'avaliacaoCliente',
        ])

        const ordem = await OrdemDeServico.create(data)
        return response.created(ordem)
    }

    /**
     *  Exibe uma OS específica
     */
    public async show({ params, response }: HttpContext) {
        const ordem = await OrdemDeServico.query()
        .where('id', params.id)
        .preload('cliente')
        .preload('tecnico')
        .preload('chamado')
        .first()

        if (!ordem) return response.notFound({ error: 'Ordem de serviço não encontrada' })
        return response.ok(ordem)
    }

    /**
     *  Atualiza OS
     */
    public async update({ params, request, response }: HttpContext) {
        const ordem = await OrdemDeServico.find(params.id)
        if (!ordem) return response.notFound({ error: 'Ordem de serviço não encontrada' })

        const data = request.only([
        'chamadoId',
        'clienteId',
        'tecnicoId',
        'descricaoProblema',
        'descricaoSolucao',
        'status',
        'tipoAtendimento',
        'dataAbertura',
        'dataFechamento',
        'tempoGastoHoras',
        'valorServico',
        'materiaisUtilizados',
        'observacoesTecnico',
        'assinaturaCliente',
        'avaliacaoCliente',
        ])

        ordem.merge(data)
        await ordem.save()

        return response.ok(ordem)
    }

    /**
     * Deleta OS
     */
    public async destroy({ params, response }: HttpContext) {
        const ordem = await OrdemDeServico.find(params.id)
        if (!ordem) return response.notFound({ error: 'Ordem de serviço não encontrada' })

        await ordem.delete()
        return response.noContent()
    }





}
