import Knex from 'knex';
// tipos == letras maisculas

// dessa forma informamos que o parametro usado terá como tipo o knex, 
//dessa forma todos os metodos e propriedades ficam disponíveis
// (parametro: Tipo )
export async function up(knex: Knex) {
    // criar a tabela
    // nome da tabela, funcao pra criar as propriedades da tabela
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable()
    });

}

export async function down(knex: Knex) {
    // drop a tabela
    // voltar um passo dado pelo metodo up
    return knex.schema.dropTable('items')
}
