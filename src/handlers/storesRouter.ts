import * as express from 'express';
import { storesController } from '../controllers';
import { HttpStatusCode } from '../domain/HttpStatusCode';

const storesRouter = express.Router();

//GEt: Get all stores
storesRouter.get('/', async (req, res, next) => {
  try {
    const response = await storesController.findAll();
    res.status(HttpStatusCode.OK).send(response);
  } catch (error) {
    next(error);
  }
});

export { storesRouter };
