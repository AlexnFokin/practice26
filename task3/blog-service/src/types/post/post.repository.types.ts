import { Post } from '@/db/models/post.model';
import { PostImage } from '@/types/post/postImage';

export interface GetPostsParams {
    viewerId?: string;
    page: number;
    limit: number;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetPostsResult {
    rows: Post[];
    count: number;
}

export interface CreatePostData {
    title: string;
    content: string;
    authorId: string;
    isPublic?: boolean;
    isHidden?: boolean;
    tags?: string[];
    images?: PostImage[];
}

export interface UpdatePostData {
    title?: string;
    content?: string;
    isPublic?: boolean;
    isHidden?: boolean;
    tags?: string[];
    images?: PostImage[];
}