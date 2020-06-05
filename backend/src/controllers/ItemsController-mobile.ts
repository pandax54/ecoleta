
import { Request, Response } from 'express';
import knex from '../database/connection';


class ItemsController {

    async index(request: Request, response: Response) {

        const items = await knex('items').select('*');

        // aula 02 1:19:00
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                // exp://192.168.0.2:19000 + 3333(localhost)
                image_url: `http://192.168.0.2:3333/uploads/${item.image}`,
            }
        })

        return response.json(serializedItems)

    }
}


export default ItemsController;
