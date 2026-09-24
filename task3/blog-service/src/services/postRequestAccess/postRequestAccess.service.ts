import { IPostAccessRequestRepository } from "@/repositories/postRequestAccess/IPostAccessRequestRepository";
import { IPostAccessRequestService } from "./IPostAccessRequestService";
import { ApiError } from "@/exceptions/api.error";

export class PostAccessRequestService implements IPostAccessRequestService {
    constructor(
        private readonly postAccessRequestRepository: IPostAccessRequestRepository,
    ) {

    }

    async requestAccess(postId: string, userId: string): Promise<{ message: string }> {
        const post = await this.postRepository.getPostById(postId);
        if (!post) throw ApiError.NotFound('Post not found');

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
            return { message: 'Доступ уже предоставлен' };
        }

        if (existing) {
            existing.status = 'pending';
            await existing.save();
        } else {
            await this.postAccessRequestRepository.create({ postId, userId });
        }

        return { message: 'Заявка на доступ отправлена' };
    }
}