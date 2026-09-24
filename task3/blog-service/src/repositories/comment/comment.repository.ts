import { Comment } from '@/db/models/comment.model';
import { ICommentRepository } from './ICommentRepository';

export class CommentRepository implements ICommentRepository {
    async getCommentsByPostId(postId: string): Promise<Comment[]> {
        return Comment.findAll({
            where: { postId },
            order: [['createdAt', 'ASC']],
        });
    }

    async create(data: {
        postId: string;
        authorId: string;
        content: string;
        parentId: string | null;
    }): Promise<Comment> {
        return Comment.create(data);
    }
}