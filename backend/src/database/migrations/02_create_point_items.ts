import Knex from 'knex';
// tipos == letras maisculas

// dessa forma informamos que o parametro usado terá como tipo o knex, 
//dessa forma todos os metodos e propriedades ficam disponíveis
// (parametro: Tipo )
export async function up(knex: Knex) {
    // criar a tabela
    // nome da tabela, funcao pra criar as propriedades da tabela
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
        // em tabletas de relacionamento entre tabelas precisaremos fazer a foreign key
        // aula 02 1:05:00
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points')

        table.integer('item_id').notNullable()
            .references('id')
            .inTable('items')

    });

}

export async function down(knex: Knex) {
    // drop a tabela
    // voltar um passo dado pelo metodo up
    return knex.schema.dropTable('point_items')
}