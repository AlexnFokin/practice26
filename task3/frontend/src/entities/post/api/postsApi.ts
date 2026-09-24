import $api from '../../../shared/api/api';
import type { Post, PostsResponse } from '../model/types';

export const postsApi = {
    list: (params: { page?: number; limit?: number; tags?: string[] } = {}) =>
        $api.get<PostsResponse>('/blog/', { params }).then((r) => r.data),

    get: (id: string) =>
        $api.get<Post>(`/blog/${id}`).then((r) => r.data),

    create: (form: FormData) =>
        $api.post<Post>('/blog/', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((r) => r.data),

    update: (id: string, form: FormData) =>
        $api.put<Post>(`/blog/${id}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((r) => r.data),

    delete: (id: string) =>
        $api.delete(`/blog/${id}`).then((r) => r.data),

    requestAccess: (id: string) =>
        $api.post(`/blog/${id}/request-access`).then((r) => r.data),
};