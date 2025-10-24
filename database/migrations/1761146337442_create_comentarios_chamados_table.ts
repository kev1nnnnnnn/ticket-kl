import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ComentariosChamado extends BaseSchema {
  protected tableName = 'comentarios_chamado'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('chamado_id').unsigned().notNullable().references('id').inTable('chamados').onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.text('comentario').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
