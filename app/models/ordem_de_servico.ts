import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Importa os models relacionados
import Chamado from './chamado.js'
import Cliente from './cliente.js'
import User from './user.js'

export default class OrdemDeServico extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Relacionamentos
  @column()
  declare chamadoId: number | null

  @column()
  declare clienteId: number

  @column()
  declare tecnicoId: number | null

  // Dados da OS
  @column()
  declare descricaoProblema: string | null

  @column()
  declare descricaoSolucao: string | null

  @column()
  declare status: 'aberta' | 'em_andamento' | 'finalizada' | 'cancelada'

  @column()
  declare tipoAtendimento: 'presencial' | 'remoto'

  // Tempo
  @column.dateTime({ autoCreate: true })
  declare dataAbertura: DateTime

  @column.dateTime()
  declare dataFechamento: DateTime | null

  @column()
  declare tempoGastoHoras: number | null

  // Financeiro
  @column()
  declare valorServico: number | null

  // Extras
  @column()
  declare materiaisUtilizados: string | null

  @column()
  declare observacoesTecnico: string | null

  @column()
  declare assinaturaCliente: string | null

  @column()
  declare avaliacaoCliente: number | null

  // 🕒 Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ──────────────── RELACIONAMENTOS ────────────────

@belongsTo(() => Chamado, { foreignKey: 'chamadoId' })
declare chamado: BelongsTo<typeof Chamado>

 @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
declare cliente: BelongsTo<typeof Cliente>

@belongsTo(() => User, { foreignKey: 'tecnicoId' })
declare tecnico: BelongsTo<typeof User>
}
