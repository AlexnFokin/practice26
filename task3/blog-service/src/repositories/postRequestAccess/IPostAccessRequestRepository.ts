import { PostAccessRequest } from '@/db/models/post-access-request.model';

export interface IPostAccessRequestRepository {
    findByPostAndUser(postId: string, userId: string): Promise<PostAccessRequest | null>;
    create(data: { postId: string; userId: string }): Promise<PostAccessRequest>;
}