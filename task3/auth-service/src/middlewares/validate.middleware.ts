import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/exceptions/api.error';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));

        return next(ApiError.BadRequest('Ошибка валидации', formattedErrors));
    }

    next();
};