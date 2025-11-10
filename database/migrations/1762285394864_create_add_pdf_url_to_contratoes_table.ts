import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPdfUrlToContratos extends BaseSchema {
  protected tableName = 'contratos'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('pdf_url').nullable() // URL ou path do PDF
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('pdf_url')
    })
  }
}
