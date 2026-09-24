import { PostAccessRequestResponseDto } from "@/dtos/postRequestAccess/PostAccessRequestResponseDto";

export interface IPostAccessRequestService {
    requestAccess(postId: string, userId: string): Promise<{ message: string }>;
    getRequestsForPost(postId: string, authorId: string): Promise<PostAccessRequestResponseDto[]>;
    respondToRequest(
        requestId: string,
        authorId: string,
        status: 'approved' | 'rejected',
    ): Promise<{ message: string }>;
    hasApprovedAccess(postId: string, userId: string): Promise<boolean>;
}