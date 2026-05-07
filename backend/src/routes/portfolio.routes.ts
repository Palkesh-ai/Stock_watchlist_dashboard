import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { addHoldingSchema } from '../validators/portfolio.validator';

const router = Router();

router.use(auth); // all portfolio routes require authentication

router.post('/', validate(addHoldingSchema), portfolioController.addHolding);
router.get('/', portfolioController.getAll);
router.delete('/:id', portfolioController.removeHolding);

export default router;
