import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo  } from '@adonisjs/lucid/orm'
import Client from './cliente.js'

export default class Contrato extends BaseModel {

  public static table = 'contratos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare numeroContrato: string

  @column.date()
  declare dataInicio: DateTime

  @column.date()
  declare dataFim: DateTime | null

  @column()
  declare valorTotal: number

  @column()
  declare ativo: boolean

  @column()
  declare pdfUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relação com cliente
  @belongsTo(() => Client, { foreignKey: 'clienteId' })
  declare cliente: any
}
