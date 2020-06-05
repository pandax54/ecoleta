import express, { request, response } from 'express';
import cors from 'cors';
import router from './routes';
import path from 'path';

const app = express();

app.use(cors())

// https://youtu.be/XEswWb5Ail8?t=1679  por padrão o express nao vem entendendo json, precisamos congifurar isso
app.use(express.json()); // plugin para entender o request em formato json

app.use('/', router)

// static aula 02 1:15:00
// ex: http://localhost:3333/uploads/lampadas.svg e irá acessar a imagem dentro da pasta com esse nome
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))


app.listen(3333);


// Routes:
// GET: /users
// GET: /users/5
// POST: /users
// PUT : /users
// DELETE: /users

// Request params: parametros que vem na propria rota que identificam um recurso
// query param: opcionais geralmente usados para filtros e paginação, ?...=  | request.query.[nome do parametro]  | exemplo: http://localhost:3333/users?search=on


// npm init -y
// npm install express
// npm install @types/express -D
// npm install ts-node -D (because node doesnt read ts)
// npm install typescript -D
// npx -> para executar pacotes instalados (n ode_modules -> .bin )
// npx tsc --init (para usar ts precisaremos de um arquivo de configuração)
// npx ts-node src/server.ts   ==> nossa app está executando depois desse comando

// npm install ts-node-dev -D   ==> nodemon equivalent refresh with updates
// npx ts-node-dev src/server.ts
// to avoid write all this we're gonna put an alias in package.json
// scripts -> "dev": "ts-node-dev src/server.ts"
// npm run dev

// DATABASE:
//sqlite
// http://knexjs.org/
//
// knex.js -> uma interface que possui uma linguagem unificada, possibilitando a utilização de qualquer banco SQL
// query builder
// SELECT * FROM users WHERE name = 'Diego'
// knex('users').where('name', 'Diego').select('*')

// npm install knex
// npm install sqlite3
// com o knex tambem poderemos criar nossas tabelas usando migrations com js
// migrations = histórico do banco de dados
// Aula 02: 50:00 criaçao da tabela de migrations
// each one with async functions up and down

// para padronizar o acesso aos paths dentro da aplicacao usaremos path
// import path from 'path' 

// CORS
// Aula 02 1:59:40
// npm install cors
// npm install @types/cors -D
// app.use(cors())
// import cors from 'cors'

// DELETING IN DATABASE
// botao direito -> new query
// escrever a query
// shoft + cmd + p >sqlite run query
// aula 02 2:03:00