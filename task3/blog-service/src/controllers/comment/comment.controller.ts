import { Request, Response, NextFunction } from 'express';
import { ICommentService } from '@/services/comment/ICommentService';
import { ICommentController } from './ICommentController';
import { ApiError } from '@/exceptions/api.error';

export class CommentController implements ICommentController {
    constructor(private readonly commentService: ICommentService) { }

    getCommentsByPost = async (
        req: Request<{ postId: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { postId } = req.params;
            const result = await this.commentService.getCommentsByPostId(postId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    addComment = async (
        req: Request<{ postId: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.headers['x-user-id'] as string;
            if (!userId) {
                throw ApiError.AccessRestricted(
                    'Только зарегистрированные пользователи могут добавлять комментарии',
                );
            }

            const { postId } = req.params;
            const { content, parentId } = req.body as {
                content: string;
                parentId?: string | null;
            };

            if (!content?.trim()) {
                throw ApiError.BadRequest('Комментарий не может быть пустым');
            }

            const result = await this.commentService.addComment({
                postId,
                authorId: userId,
                content: content.trim(),
                parentId: parentId ?? null,
            });

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}