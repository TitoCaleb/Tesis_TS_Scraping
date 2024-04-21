import * as express from 'express';
import { productsController } from '../controllers';
import { HttpStatusCode } from '../domain/HttpStatusCode';

const productsRouter = express.Router();

//GEt: Get all products
productsRouter.get('/', async (req, res, next) => {
  try {
    const response = await productsController.findAll(req);
    res.status(HttpStatusCode.OK).send(response);
  } catch (error) {
    next(error);
  }
});

//GEt: Get product by name
productsRouter.get('/findByName', async (req, res, next) => {
  try {
    const response = await productsController.findByName(req);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

//GEt: Get product by categoty
productsRouter.get('/findByCategory', async (req, res, next) => {
  try {
    const response = await productsController.findByCategory(req);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

export { productsRouter };
