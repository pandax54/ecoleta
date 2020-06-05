import express, { request, response } from 'express';
// import knex from './database/connection'; // criar conexao com banco de dados
import PointsController from './controllers/PointsController-mobile';
//import PointsController from './controllers/PointsController'; --> para web descomente esse e comente a linha acima
import ItemsController from './controllers/ItemsController-mobile';
//import ItemsController from './controllers/ItemsController'; --> para web descomente esse e comente a linha acima
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';


const router = express.Router()
const upload = multer(multerConfig); // colocar o multer como middleware da rota que receberá as imagens


const pointController = new PointsController();
const itemsController = new ItemsController();

// router.get('/', (request, response) => {
//     return response.json({ message: 'Hello' })
// });

router.get('/items', itemsController.index)

// aula 05 11:00 - uploads de imagens
// upload.single() -> um único arquivo
// para uploads de várias fotos usa-se upload.array('fotos') 
// validacao aula 05 45:29
router.post('/points', upload.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
    })
}, {
    abortEarly: false
}), pointController.create);

router.put('/points/:id', upload.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
    })
}, {
    abortEarly: false
}), pointController.put);

router.delete('/points/:id', pointController.delete)
router.get('/points', pointController.filter);
router.get('/points/all', pointController.index);
router.get('/points/:id', pointController.show);



module.exports = router;


// aula 05 12:00
// json nao suporta upload de arquivos
// iremos utilizar o formData
// trocar no inmsonia de json -> multipart Form