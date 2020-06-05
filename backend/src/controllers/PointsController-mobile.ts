import knex from '../database/connection'; // criar conexao com banco de dados
import { Request, Response } from 'express';

class PointsController {

    async index(request: Request, response: Response) {
        const points = await knex('points').select('*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.2:3333/uploads/${point.image}`
            }
        })

        return response.json(points)
    }

    async filter(request: Request, response: Response) {
        // query params ==> filtros
        const { city, uf, items } = request.query;

        // strings -> array
        // .trim() -> remove white spaces
        const parseItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parseItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.2:3333/uploads/${point.image}`
            }
        })

        //console.log(city, uf, items)
        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(404).json({ message: "Point not found" })
        }

        // aula 02 1:45:00
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.2:3333/uploads/${point.image}`
        }

        return response.json({
            items,
            point: serializedPoint
        });

    }

    // dentro da classe precisa dar um nome pra função
    // aula 02 1:36:10
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        // aqui temos duas inserções no banco de dados
        // e como uma depende da outra criamos uma transação 
        // para que caso uma falhe a outra nao execute
        const trx = await knex.transaction();
        // agora vc substitui onde teria knex por trx
        // aula 02 1:33:00

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        // inserir na tabela de points
        // o knex retorna os ids dos registros inseridos
        // como foi criado apenas um, podemos utilizar ids[0] para inserir abaixo na tabela de relacionamento
        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];


        // inserir na tabela de relacionamentos
        // aula 02 1:29:00
        // criando objetos para inserir na tabela
        // aula 05 15:00 -> agora items sao string separadas por vírgula
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            });

        await trx('point_items').insert(pointItems);

        // aula 02 1:57:50
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
        });
    }
    async delete(request: Request, response: Response) {
        const { id } = request.params

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(404).json({ message: "Point not found" })
        }

        await knex('points').where('id', id).delete()

        return response.status(204).send("Point deleted");

    }

}


export default PointsController;




        //=========================INSOMINIA JSON OBJECT=======================================
        // req.body object
        // post : http://localhost:3333/points
        // {
        //     "image": "image-fake",  
        //   "name" : "Mercado Imperatriz",
        //   "email": "contato@imperatriz.com.br",
        //   "whatsapp": "47999284859",
        //   "latitude": "-46.81273213",
        //   "longitude": "-35.19238112",
        //   "city": "Rio do Sul",
        //   "uf": "SC",
        //   "items": [
        //               1,
        //               2,
        //               6
        //           ]
        // }