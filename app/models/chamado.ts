import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Categoria from './categoria.js'
import ComentarioChamado from './comentario_chamado.js'

export default class Chamado extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titulo: string

  @column()
  declare descricao: string | null

  @column()
  declare status: 'aberto' | 'em_progresso' | 'resolvido' | 'cancelado'

  @column()
  declare prioridade: 'baixa' | 'media' | 'alta' | 'urgente'

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'tecnico_id' })
  declare tecnicoId: number | null

  @column({ columnName: 'categoria_id' })
  declare categoriaId: number | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'closed_at' })
  declare closedAt: DateTime | null

  // Relacionamentos
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare usuario: any

  @belongsTo(() => User, { foreignKey: 'tecnicoId' })
  declare tecnico: any

  @belongsTo(() => Categoria, { foreignKey: 'categoriaId' })
  declare categoria: any

  @hasMany(() => ComentarioChamado)
  declare comentarios: any
}
