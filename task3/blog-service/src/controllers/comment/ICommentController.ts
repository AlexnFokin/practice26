import { Request, Response, NextFunction } from 'express';

export interface ICommentController {
    getCommentsByPost: (
        req: Request<{ postId: string }>,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;

    addComment: (
        req: Request<{ postId: string }>,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;
}