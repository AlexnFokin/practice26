import $api from '../../../shared/api/api';
import type { Comment } from '../model/types';

export interface CreateCommentData {
    postId: string;
    content: string;
    parentId?: string | null;
}

export const commentsApi = {
    getByPost: (postId: string) =>
        $api.get<Comment[]>(`/comments/post/${postId}`).then((r) => r.data),

    create: ({ postId, content, parentId }: CreateCommentData) =>
        $api
            .post<Comment>(`/comments/post/${postId}`, {
                content,
                ...(parentId ? { parentId } : {}),
            })
            .then((r) => r.data),
};