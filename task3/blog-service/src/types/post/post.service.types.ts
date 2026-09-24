import { PostResponseDto } from '@/dtos/post/PostResponseDto';
import { GetPostsQueryDto } from '@/dtos/post/GetPostsQueryDto';

export interface GetPostsServiceData extends GetPostsQueryDto {
    userId?: string;
}

export interface GetPostsServiceResult {
    posts: PostResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetPostByIdParams {
    id: string;
    userId?: string;
}