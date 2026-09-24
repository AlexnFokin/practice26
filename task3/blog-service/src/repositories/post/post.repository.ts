import { Op, WhereOptions, Order } from 'sequelize';
import { Post } from '@/db/models/post.model';
import {
    GetPostsParams,
    GetPostsResult,
    CreatePostData,
    UpdatePostData,
} from '@/types/post';
import { IPostRepository } from './IPostRepository';

const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'title'] as const;

export class PostRepository implements IPostRepository {
    async getPosts(params: GetPostsParams): Promise<GetPostsResult> {
        const { viewerId, page, limit, tags, sortBy, sortOrder } = params;

        const safePage = Math.max(1, Number(page) || 1);
        const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
        const offset = (safePage - 1) * safeLimit;

        const where = this.buildWhere(viewerId, tags);

        const { rows, count } = await Post.findAndCountAll({
            where,
            order: this.buildOrder(sortBy, sortOrder),
            limit: safeLimit,
            offset,
        });

        return { rows, count };
    }

    async getPostById(id: string): Promise<Post | null> {
        return Post.findOne({ where: { id } });
    }

    async createPost(data: CreatePostData): Promise<Post> {
        return Post.create(data);
    }

    async updatePost(
        id: string,
        authorId: string,
        data: UpdatePostData,
    ): Promise<Post | null> {
        const [affectedCount, updatedRows] = await Post.update(data, {
            where: { id, authorId },
            returning: true,
        });

        if (affectedCount === 0) return null;
        return updatedRows[0];
    }

    async deletePost(id: string): Promise<boolean> {
        const deletedCount = await Post.destroy({ where: { id } });
        return deletedCount > 0;
    }

    private buildWhere(viewerId?: string, tags?: string[]): WhereOptions {
        const visibility = this.buildVisibilityWhere(viewerId);
        const tagsWhere = this.buildTagsWhere(tags);

        if (!tagsWhere) return visibility;
        return { [Op.and]: [visibility, tagsWhere] };
    }

    private buildVisibilityWhere(viewerId?: string): WhereOptions {
        if (!viewerId) {
            return { isPublic: true, isHidden: false };
        }
        return {
            [Op.or]: [
                { isPublic: true, isHidden: false },
                { authorId: viewerId },
            ],
        };
    }

    private buildTagsWhere(tags?: string[] | string): WhereOptions | null {
        if (!tags) return null;

        const arr = Array.isArray(tags) ? tags : String(tags).split(',');
        const clean = arr.map(String).filter(Boolean);

        if (clean.length === 0) return null;
        return { tags: { [Op.overlap]: clean } };
    }

    private buildOrder(sortBy?: string, sortOrder?: 'asc' | 'desc'): Order {
        const field = (SORTABLE_FIELDS as readonly string[]).includes(sortBy ?? '')
            ? (sortBy as string)
            : 'createdAt';
        const direction = sortOrder === 'asc' ? 'ASC' : 'DESC';
        return [[field, direction]];
    }
}