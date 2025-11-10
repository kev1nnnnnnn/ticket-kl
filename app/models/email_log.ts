import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EmailLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare destinatario: string

  @column()
  declare assunto: string

  @column()
  declare mensagem: string

  @column()
  declare status: 'enviado' | 'falhou'

  @column()
  declare erro?: string

  @column.dateTime()
  declare dataEnvio: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
