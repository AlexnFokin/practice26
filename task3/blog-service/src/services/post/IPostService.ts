import { CreatePostDto } from '@/dtos/post/CreatePostDto';
import { UpdatePostDto } from '@/dtos/post/UpdatePostDto';
import { PostResponseDto } from '@/dtos/post/PostResponseDto';
import { PostWithCommentsDto } from '@/dtos/post/PostWithCommentsDto';
import {
    GetPostByIdParams,
    GetPostsServiceData,
    GetPostsServiceResult,
} from '@/types/post';
import { RequestAccessResponseDto } from '@/dtos/postRequestAccess/RequestAccessResponseDto';

export interface IPostService {
    getPosts(data: GetPostsServiceData): Promise<GetPostsServiceResult>;
    getPostById(params: GetPostByIdParams): Promise<PostWithCommentsDto>;
    createPost(userId: string, data: CreatePostDto): Promise<PostResponseDto>;
    updatePost(id: string, userId: string, data: UpdatePostDto): Promise<PostResponseDto>;
    deletePost(id: string, userId: string): Promise<{ message: string }>;
    requestAccess(postId: string, userId: string): Promise<RequestAccessResponseDto>;
    deletePost(id: string, userId: string): Promise<{ message: string }>;
}