// arquivo responsavel pela conexao com o bando de dados

import knex from 'knex';
import path from 'path';

// __dirname -> retorna para o diretório do arquivo que está executando no momento (39:20 -> aula 02)

// knex({}) --> recebe as configuracoes das conexoes com o DB

const connection = knex({
    client: 'sqlite3',
    connection: {
        // filename da database
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
})


export default connection;