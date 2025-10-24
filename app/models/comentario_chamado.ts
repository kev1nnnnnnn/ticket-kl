import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Chamado from './chamado.js'
import User from './user.js'

export default class ComentarioChamado extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'chamado_id' })
  declare chamadoId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare comentario: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relacionamentos
  @belongsTo(() => Chamado, { foreignKey: 'chamadoId' })
  declare chamado: any

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare usuario: any
}
