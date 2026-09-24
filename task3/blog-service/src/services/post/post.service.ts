import { IPostRepository } from '@/repositories/post/IPostRepository';
import { ICommentService } from '@/services/comment/ICommentService';
import { IPostService } from './IPostService';
import { CreatePostDto } from '@/dtos/post/CreatePostDto';
import { UpdatePostDto } from '@/dtos/post/UpdatePostDto';
import { PostResponseDto } from '@/dtos/post/PostResponseDto';
import { PostWithCommentsDto } from '@/dtos/post/PostWithCommentsDto';
import { GetPostByIdParams, GetPostsServiceData, GetPostsServiceResult } from '@/types/post';
import { Post } from '@/db/models/post.model';
import { ApiError } from '@/exceptions/api.error';
import { IPostAccessRequestRepository } from '@/repositories/postRequestAccess/IPostAccessRequestRepository';
import { RequestAccessResponseDto } from '@/dtos/postRequestAccess/RequestAccessResponseDto';

export class PostService implements IPostService {
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly commentService: ICommentService,
        private readonly postAccessRequestRepository: IPostAccessRequestRepository,
    ) { }

    async getPosts(data: GetPostsServiceData): Promise<GetPostsServiceResult> {
        const { userId: viewerId, page, limit, tags, sortBy, sortOrder } = data;

        const { rows, count } = await this.postRepository.getPosts({
            viewerId,
            page,
            limit,
            tags,
            sortBy,
            sortOrder,
        });

        return {
            posts: rows.map((row) => this.toResponse(row)),
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }

    async getPostById(params: GetPostByIdParams): Promise<PostWithCommentsDto> {
        const { id, userId } = params;

        const post = await this.postRepository.getPostById(id);
        if (!post) {
            throw ApiError.NotFound('Post not found');
        }

        const isAuthor = userId !== undefined && post.authorId === userId;
        const isVisibleToGuests = post.isPublic && !post.isHidden;

        let hasApproved = false;
        if (!isAuthor && !isVisibleToGuests && userId) {
            hasApproved = await this.hasApprovedAccess(id, userId);
        }

        if (!isAuthor && !isVisibleToGuests && !hasApproved) {
            throw ApiError.AccessRestricted('Access denied');
        }

        const comments = await this.commentService.getCommentsByPostId(id);

        return new PostWithCommentsDto({
            post: this.toResponse(post),
            comments,
        });
    }

    async createPost(userId: string, data: CreatePostDto): Promise<PostResponseDto> {
        const post = await this.postRepository.createPost({
            ...data,
            authorId: userId,
        });

        return this.toResponse(post);
    }

    async updatePost(id: string, userId: string, data: UpdatePostDto): Promise<PostResponseDto> {

        const updatedPost = await this.postRepository.updatePost(id, userId, data)

        if (!updatedPost) {
            throw ApiError.NotFound('Такого поста не существует или вы не являетесь автором');
        }

        return this.toResponse(updatedPost);
    }

    async deletePost(id: string, userId: string): Promise<{ message: string }> {
        const post = await this.postRepository.getPostById(id);
        if (!post) {
            throw ApiError.NotFound('Post not found');
        }

        if (post.authorId !== userId) {
            throw ApiError.AccessRestricted('Только автор может удалить пост');
        }

        await this.postRepository.deletePost(id);

        return { message: 'Пост удалён' };
    }

    async requestAccess(postId: string, userId: string): Promise<RequestAccessResponseDto> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw ApiError.NotFound('Post not found');
        }

        if (post.authorId === userId) {
            throw ApiError.BadRequest('Вы автор этого поста');
        }

        if (post.isPublic && !post.isHidden) {
            throw ApiError.BadRequest('Пост уже доступен');
        }

        const existing = await this.postAccessRequestRepository.findByPostAndUser(postId, userId);

        if (existing?.status === 'pending') {
            throw ApiError.BadRequest('Заявка уже отправлена');
        }

        if (existing?.status === 'approved') {
            return new RequestAccessResponseDto({ message: 'Доступ уже предоставлен' });
        }

        if (existing) {
            existing.status = 'pending';
            await existing.save();
        } else {
            await this.postAccessRequestRepository.create({ postId, userId });
        }

        return new RequestAccessResponseDto({ message: 'Заявка на доступ отправлена' });
    }

    private async hasApprovedAccess(postId: string, userId: string): Promise<boolean> {
        const request = await this.postAccessRequestRepository.findByPostAndUser(postId, userId);
        return request?.status === 'approved';
    }


    private toResponse(post: Post): PostResponseDto {
        return new PostResponseDto({
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.authorId,
            isPublic: post.isPublic,
            isHidden: post.isHidden,
            tags: post.tags ?? [],
            images: post.images ?? [],
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        });
    }
}