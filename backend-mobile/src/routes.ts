import express, { request, response } from 'express';
// import knex from './database/connection'; // criar conexao com banco de dados
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const router = express.Router()

const pointController = new PointsController();
const itemsController = new ItemsController();

// router.get('/', (request, response) => {
//     return response.json({ message: 'Hello' })
// });

router.get('/items', itemsController.index)


router.post('/points', pointController.create);
router.get('/points', pointController.filter);
router.get('/points/all', pointController.index);
router.get('/points/:id', pointController.show);



module.exports = router; 