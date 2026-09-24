export enum AccessRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface AccessRequestResponse {
    id: string;
    postId: string;
    userId: string;
    status: AccessRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}