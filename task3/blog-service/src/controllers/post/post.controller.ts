import { Request, Response, NextFunction } from 'express';
import { CreatePostDto } from '@/dtos/post/CreatePostDto';
import { UpdatePostDto } from '@/dtos/post/UpdatePostDto';
import { GetPostsQueryDto } from '@/dtos/post/GetPostsQueryDto';
import { IPostService } from '@/services/post/IPostService';
import { IPostController } from './IPostController';
import { ApiError } from '@/exceptions/api.error';

export class PostController implements IPostController {
    constructor(private readonly postService: IPostService) { }

    getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.headers['x-user-id'] as string | undefined;
            const query = req.query as unknown as GetPostsQueryDto;

            const result = await this.postService.getPosts({
                userId,
                page: query.page,
                limit: query.limit,
                tags: query.tags,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            });

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getPostById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.headers['x-user-id'] as string | undefined;
            const result = await this.postService.getPostById({ id, userId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.headers['x-user-id'] as string;

            if (!userId) {
                throw ApiError.UnauthorizedError();
            }

            const files = (req.files as Express.Multer.File[]) ?? [];
            const images = files.map((f, i) => ({
                url: `/media/posts/${f.filename}`,
                alt: '',
                size: f.size,
                mimetype: f.mimetype,
                order: i,
            }));

            // парсим tags — из multipart приходит строкой
            let tags: string[] | undefined;
            if (req.body.tags) {
                if (Array.isArray(req.body.tags)) {
                    tags = req.body.tags.map(String).filter(Boolean);
                } else {
                    try {
                        const parsed = JSON.parse(req.body.tags);
                        tags = Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : undefined;
                    } catch {
                        tags = String(req.body.tags)
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean);
                    }
                }
            }

            const dto: CreatePostDto = {
                title: req.body.title,
                content: req.body.content,
                isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
                isHidden: req.body.isHidden === 'true' || req.body.isHidden === true,
                tags,
                images,
            };

            const result = await this.postService.createPost(userId, dto);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.headers['x-user-id'] as string;
            if (!userId) {
                throw ApiError.UnauthorizedError();
            }

            const files = (req.files as Express.Multer.File[]) ?? [];

            // новые картинки из файлов
            const newImages = files.map((f, i) => ({
                url: `/media/posts/${f.filename}`,
                alt: '',
                size: f.size,
                mimetype: f.mimetype,
                order: i,
            }));

            // какие старые картинки оставить — приходят JSON-строкой
            let existingImages: { url: string; alt?: string; order?: number }[] = [];
            if (req.body.existingImages) {
                try {
                    const parsed = JSON.parse(req.body.existingImages);
                    existingImages = Array.isArray(parsed) ? parsed : [];
                } catch {
                    existingImages = [];
                }
            }

            // теги — строка из multipart
            let tags: string[] | undefined;
            if (req.body.tags !== undefined) {
                if (Array.isArray(req.body.tags)) {
                    tags = req.body.tags.map(String).filter(Boolean);
                } else {
                    try {
                        const parsed = JSON.parse(req.body.tags);
                        tags = Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
                    } catch {
                        tags = String(req.body.tags)
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean);
                    }
                }
            }

            const dto: UpdatePostDto = {
                ...(req.body.title !== undefined && { title: req.body.title }),
                ...(req.body.content !== undefined && { content: req.body.content }),
                ...(req.body.isPublic !== undefined && {
                    isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
                }),
                ...(req.body.isHidden !== undefined && {
                    isHidden: req.body.isHidden === 'true' || req.body.isHidden === true,
                }),
                ...(tags !== undefined && { tags }),
                ...((files.length > 0 || req.body.existingImages !== undefined) && {
                    images: [...existingImages, ...newImages],
                }),
            };

            const result = await this.postService.updatePost(id, userId, dto);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.headers['x-user-id'] as string;

            if (!userId) {
                throw ApiError.UnauthorizedError();
            }

            const result = await this.postService.deletePost(id, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    requestAccess = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.headers['x-user-id'] as string;
            if (!userId) throw ApiError.UnauthorizedError();

            const result = await this.postService.requestAccess(id, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}