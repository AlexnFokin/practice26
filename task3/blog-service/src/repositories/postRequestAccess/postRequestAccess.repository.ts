import { PostAccessRequest } from '@/db/models/post-access-request.model';
import { IPostAccessRequestRepository } from './IPostAccessRequestRepository';

export class PostAccessRequestRepository implements IPostAccessRequestRepository {
    async findByPostAndUser(
        postId: string,
        userId: string,
    ): Promise<PostAccessRequest | null> {
        return PostAccessRequest.findOne({ where: { postId, userId } });
    }

    async create(data: { postId: string; userId: string }): Promise<PostAccessRequest> {
        return PostAccessRequest.create(data);
    }
}