import { AccessRequestStatus } from '@/types/access-request.types';

export class CreateAccessRequestDto {
    // ничего не нужно, всё из params
}

export class UpdateAccessRequestDto {
    status: AccessRequestStatus;
}

export class AccessRequestResponseDto {
    id: string;
    postId: string;
    userId: string;
    status: AccessRequestStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: any) {
        this.id = data.id;
        this.postId = data.postId;
        this.userId = data.userId;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}