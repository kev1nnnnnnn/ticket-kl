import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('cliente_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE') // se deletar o cliente, deleta contratos

      table.string('numero_contrato').notNullable().unique()
      table.date('data_inicio').notNullable()
      table.date('data_fim').nullable()
      table.decimal('valor_total', 12, 2).notNullable()
      table.boolean('ativo').defaultTo(true)

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
