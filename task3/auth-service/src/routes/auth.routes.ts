import { Router } from "express";
import { body } from "express-validator";
import { AuthController as AuthContorllerClass } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";

const AuthContorller = new AuthContorllerClass();

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 5, max: 18 }).withMessage('Пароль минимум 5 символов максимум 18'),
    body('firstName').notEmpty().withMessage('Имя обязательно'),
    validate,
    AuthContorller.register);

router.post('/login',
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 5, max: 18 }).withMessage('Пароль минимум 5 символов максимум 18'),
    validate,
    AuthContorller.login);

router.post('/logout', AuthContorller.logout);
router.get('/refresh', AuthContorller.refresh);

export { router }