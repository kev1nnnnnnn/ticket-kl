import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Categoria from './categoria.js'
import ComentarioChamado from './comentario_chamado.js'
import db from '@adonisjs/lucid/services/db'

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

  /**
   * 🔹 Chamados agrupados por status
   */
  public static async porStatus() {
    return db.from('chamados').select('status').count('* as total').groupBy('status')
  }

  /**
   * 🔹 Chamados agrupados por prioridade
   */
  public static async porPrioridade() {
    return db.from('chamados').select('prioridade').count('* as total').groupBy('prioridade')
  }

  /**
   * 🔹 Chamados nos últimos X dias
   */
  public static async ultimosDias(dias: number) {
    const data = DateTime.now().minus({ days: dias }).toSQLDate()
    return db
      .from('chamados')
      .select(db.raw('DATE(created_at) as data'))
      .count('* as total')
      .where('created_at', '>=', data)
      .groupByRaw('DATE(created_at)')
      .orderBy('data', 'asc')
  }

  /**
   * 🔹 Tempo médio de resolução
   */
  public static async tempoMedioResolucao() {
    const resultado = await db
      .from('chamados')
      .whereNotNull('closed_at')
      .select(db.raw('AVG(TIMESTAMPDIFF(HOUR, created_at, closed_at)) as media_horas'))
      .first()
    
    return Number(resultado?.media_horas ?? 0).toFixed(1)
  }

  /**
   * 🔹 Retorna todos os chamados com relacionamentos
   */
  public static async todosComRelacionamentos() {
    return this.query()
      .preload('usuario')
      .preload('tecnico')
      .preload('categoria')
      .preload('comentarios')
  }
}
