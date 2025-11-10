import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrdemDeServicos extends BaseSchema {
  protected tableName = 'ordem_de_servicos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relacionamentos
      table
        .integer('chamado_id')
        .unsigned()
        .references('id')
        .inTable('chamados')
        .onDelete('SET NULL')
        .nullable()

      table
        .integer('cliente_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('tecnico_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()

      // Dados da O.S.
      table.text('descricao_problema').nullable()
      table.text('descricao_solucao').nullable()
      table.enu('status', ['aberta', 'em_andamento', 'finalizada', 'cancelada']).defaultTo('aberta')
      table.enu('tipo_atendimento', ['presencial', 'remoto']).defaultTo('presencial')

      // Controle de tempo
      table.timestamp('data_abertura').defaultTo(this.now())
      table.timestamp('data_fechamento').nullable()
      table.decimal('tempo_gasto_horas', 5, 2).nullable()

      // Financeiro (opcional)
      table.decimal('valor_servico', 10, 2).nullable()

      // Extras
      table.text('materiais_utilizados').nullable()
      table.text('observacoes_tecnico').nullable()
      table.string('assinatura_cliente').nullable() // pode ser caminho de imagem ou base64
      table.integer('avaliacao_cliente').nullable() // nota 1 a 5

      // 🕒 Timestamps
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
