import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { signupSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', auth, authController.getMe);

export default router;
