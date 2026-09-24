import { ICommentRepository } from '@/repositories/comment/ICommentRepository';
import { ICommentService } from './ICommentService';
import { CommentResponseDto } from '@/dtos/comment/CommentResponseDto';
import { Comment } from '@/db/models/comment.model';
import { CommentTreeDto } from '@/dtos/comment/CommentTreeDto';

export class CommentService implements ICommentService {
    constructor(private readonly commentRepository: ICommentRepository) { }

    async getCommentsByPostId(postId: string): Promise<CommentTreeDto[]> {
        const comments = await this.commentRepository.getCommentsByPostId(postId);
        return this.buildTree(comments);
    }

    async addComment(data: {
        postId: string;
        authorId: string;
        content: string;
        parentId?: string | null;
    }): Promise<CommentResponseDto> {
        const comment = await this.commentRepository.create({
            postId: data.postId,
            authorId: data.authorId,
            content: data.content,
            parentId: data.parentId ?? null,
        });

        return this.toResponse(comment);
    }

    private buildTree(comments: Comment[]): CommentTreeDto[] {
        const map = new Map<string, CommentTreeDto>();
        const roots: CommentTreeDto[] = [];

        for (const c of comments) {
            map.set(c.id, new CommentTreeDto({
                id: c.id,
                postId: c.postId,
                authorId: c.authorId,
                content: c.content,
                parentId: c.parentId,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
                replies: [],
            }));
        }

        for (const node of map.values()) {
            if (node.parentId && map.has(node.parentId)) {
                map.get(node.parentId)!.replies.push(node);
            } else {
                roots.push(node);
            }
        }

        return roots;
    }

    private toResponse(comment: Comment): CommentResponseDto {
        return new CommentResponseDto({
            id: comment.id,
            postId: comment.postId,
            authorId: comment.authorId,
            content: comment.content,
            parentId: comment.parentId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        });
    }
}