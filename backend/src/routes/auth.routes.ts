import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { loginController, meController, registerController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.get('/me', requireAuth, meController);

export default router;
