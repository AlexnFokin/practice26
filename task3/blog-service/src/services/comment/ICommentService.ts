import { CommentResponseDto } from '@/dtos/comment/CommentResponseDto';
import { CommentTreeDto } from '@/dtos/comment/CommentTreeDto';

export interface ICommentService {
    getCommentsByPostId(postId: string): Promise<CommentTreeDto[]>;
    addComment(data: {
        postId: string;
        authorId: string;
        content: string;
        parentId?: string | null;
    }): Promise<CommentResponseDto>;
}