import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Enderecos extends BaseSchema {
  protected tableName = 'enderecos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('rua').notNullable()
      table.string('numero').notNullable()
      table.string('bairro')
      table.string('cidade').notNullable()
      table.string('estado').notNullable()
      table.string('cep', 9)
      table
        .integer('cliente_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE') // se apagar o cliente, apaga o endereço também
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
