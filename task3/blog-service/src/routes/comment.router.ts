import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '@/middlewares/validate.middleware';
import { container } from '@/container';
import { CommentController } from '@/controllers/comment/comment.controller';


const router = Router();
const commentController = container.getController<CommentController>('commentController');

// Получить комментарии к посту
router.get(
    '/post/:postId',
    param('postId').isUUID(),
    validate,
    commentController.getCommentsByPost,
);

// Добавить комментарий
router.post(
    '/post/:postId',
    param('postId').isUUID(),
    body('content').notEmpty().withMessage('Комментарий не может быть пустым'),
    body('parentId').optional({ nullable: true }).isUUID(),
    validate,
    commentController.addComment,
);

export { router };