import * as express from 'express';
import {
  boomErrorHandler,
  errorHandler,
  logErrors,
} from '../middlewares/errorMiddleware';
import { productsRouter } from './productsRouter';
import { storesRouter } from './storesRouter';
import { productsController } from '../controllers';
import * as cron from 'node-cron';
import * as cors from 'cors';

const app = express();

//Habilitar CORS
const whitelist = ['http://localhost:5173'];
const options: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin || '') || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
};
app.use(cors(options));
const PORT = process.env.PORT;

//Enrutamiento
const routerApi = (app: express.Application) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/stores', storesRouter);
};

//Middlewares
routerApi(app);
app.use(express.json());
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Creacion base de dato
// let task = cron.schedule('*/2 * * * *', () => {
//   // "59 59 23 * * *"
//   productsController.scrape();
//   console.log('Se corre la tarea cada 1 dia');
// });

// task.start();

productsController.scrape();

// Inicializacion del servidor
app.listen(PORT, () => {
  console.log(`El backend se inicio en el puerto ${PORT}`);
});
