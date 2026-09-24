import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';

const router = Router();
const userController = new UserController();

router.get('/me', userController.getProfile.bind(userController));
router.put('/me', userController.updateProfile.bind(userController));

export { router };