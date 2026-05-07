import { Router } from 'express';
import * as stockController from '../controllers/stock.controller';
import auth from '../middlewares/auth';

const router = Router();

router.get('/search', auth, stockController.searchStock);
router.get('/query', auth, stockController.queryStocks);
router.get('/candles', auth, stockController.getCandles);

export default router;
