import { Post } from '@/db/models/post.model';
import {
    GetPostsParams,
    GetPostsResult,
    CreatePostData,
    UpdatePostData,
} from '@/types/post';

export interface IPostRepository {
    getPosts(params: GetPostsParams): Promise<GetPostsResult>;
    getPostById(id: string): Promise<Post | null>;
    createPost(data: CreatePostData): Promise<Post>;
    updatePost(id: string, authorId: string, data: UpdatePostData): Promise<Post | null>;
    deletePost(id: string): Promise<boolean>;
}