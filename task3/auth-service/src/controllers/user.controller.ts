import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';

const userService = new UserService();

class UserController {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.headers['x-user-id'] as string;
            const userDto = await userService.getProfile(userId);
            res.json(userDto);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.headers['x-user-id'] as string;
            const { firstName, email } = req.body;
            const userDto = await userService.updateProfile(userId, { firstName, email });
            res.json(userDto);
        } catch (error) {
            next(error);
        }
    }
}

export { UserController };