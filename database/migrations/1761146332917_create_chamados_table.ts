import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Chamados extends BaseSchema {
  protected tableName = 'chamados'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titulo').notNullable()
      table.text('descricao').nullable()
      table
        .enu('status', ['aberto', 'em_progresso', 'resolvido', 'cancelado'])
        .notNullable()
        .defaultTo('aberto')
      table
        .enu('prioridade', ['baixa', 'media', 'alta', 'urgente'])
        .notNullable()
        .defaultTo('media')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('tecnico_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.integer('categoria_id').unsigned().nullable().references('id').inTable('categorias').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('closed_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
