import * as express from 'express';
import { categoryController } from '../controllers';
import { HttpStatusCode } from '../domain/HttpStatusCode';

const categoryRouter = express.Router();

//GEt: Get all categories
categoryRouter.get('/', async (req, res, next) => {
  try {
    const response = await categoryController.findAll();
    res.status(HttpStatusCode.OK).send(response);
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
