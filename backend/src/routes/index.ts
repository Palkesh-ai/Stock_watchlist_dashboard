import { Router } from 'express';
import authRoutes from './auth.routes';
import stockRoutes from './stock.routes';
import watchlistRoutes from './watchlist.routes';
import portfolioRoutes from './portfolio.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stocks', stockRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/portfolio', portfolioRoutes);

export default router;
