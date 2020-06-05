import path from 'path';
// knex nao suporta export default

module.exports = {
    client: 'sqlite3',
    connection: {
        // filename da database
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite') // o path aqui é diferente
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};

// comando para executar as migrations
// no comando deve colocar o path pro arquico knexfile.ts, mas como ele está na raiz nao precisa colocar nada
// npx knex migrate:latest --knexfile knexfile.ts migrate:latest
// esse comando pode ser colocado como atalho no package.json
// aula 02 59:00
// com essa comando ele gera o arquivo database.sqlite na pasta database

// shift+cmd+p >sqlite open database
// na barra de comandos a esquerda aparecerá uma aba chamada: SQLITE EXPLORER
// selecione uma, clique com o botao direito do mouse > show table
