import { Router } from 'express';
import * as watchlistController from '../controllers/watchlist.controller';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { addToWatchlistSchema } from '../validators/watchlist.validator';

const router = Router();

router.use(auth); // all watchlist routes require authentication

router.post('/', validate(addToWatchlistSchema), watchlistController.addItem);
router.get('/', watchlistController.getAll);
router.delete('/:symbol', watchlistController.removeItem);

export default router;
