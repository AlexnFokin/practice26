import { Router } from 'express';
import { router as authRouter } from './auth.routes';
import { router as userRouter } from './user.routes';

const router = Router();

router.use('/', authRouter);
router.use('/users', userRouter);

export { router };