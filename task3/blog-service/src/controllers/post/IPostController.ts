import { Request, Response, NextFunction } from 'express';

export interface IPostController {
    getPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPostById: (req: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
    createPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePost: (req: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
    deletePost: (req: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
    requestAccess: (req: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
}