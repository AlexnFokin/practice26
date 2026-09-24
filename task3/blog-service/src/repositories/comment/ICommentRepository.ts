import { Comment } from '@/db/models/comment.model';

export interface ICommentRepository {
    getCommentsByPostId(postId: string): Promise<Comment[]>;
    create(data: {
        postId: string;
        authorId: string;
        content: string;
        parentId: string | null;
    }): Promise<Comment>;
}