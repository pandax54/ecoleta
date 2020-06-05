import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// aula 05 4:00 - upload de imagens
// https://github.com/expressjs/multer
export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto.randomBytes(6).toString('hex');

            const filename = `${hash}-${file.originalname}`;

            // callback(err, results)
            callback(null, filename);
        }
    }),
}

// configurar agora no routes.ts

// aula 05 12:00
// json nao suporta upload de arquivos
// iremos utilizar o formData
// trocar no inmsonia de json -> multipart Form