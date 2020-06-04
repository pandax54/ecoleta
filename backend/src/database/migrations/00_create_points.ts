import Knex from 'knex';
// tipos == letras maisculas

// dessa forma informamos que o parametro usado terá como tipo o knex, 
//dessa forma todos os metodos e propriedades ficam disponíveis
// (parametro: Tipo )
export async function up(knex: Knex) {
    // criar a tabela
    // nome da tabela, funcao pra criar as propriedades da tabela
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('whatsapp').notNullable()
        table.decimal('latitude').notNullable()
        table.decimal('longitude').notNullable()
        table.string('city').notNullable()
        table.string('uf', 2).notNullable()
    });

}

export async function down(knex: Knex) {
    // drop a tabela
    // voltar um passo dado pelo metodo up
    return knex.schema.dropTable('points')
}


// para executar as migrations é preciso criar na raiz do projeto a file: knexfile.ts 