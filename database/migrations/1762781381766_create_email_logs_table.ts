import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EmailLogsSchema extends BaseSchema {
  protected tableName = 'email_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('destinatario', 255).notNullable()
      table.string('assunto', 255)
      table.text('mensagem')
      table.enu('status', ['enviado', 'falhou']).defaultTo('enviado')
      table.text('erro').nullable()
      table.dateTime('data_envio').defaultTo(this.now())

      // ✅ Campos automáticos usados pelo Model
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
