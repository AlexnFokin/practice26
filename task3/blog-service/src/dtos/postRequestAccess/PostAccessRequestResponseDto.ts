export class PostAccessRequestResponseDto {
    id!: string;
    postId!: string;
    userId!: string;
    status!: 'pending' | 'approved' | 'rejected';
    createdAt!: Date;
    updatedAt!: Date;

    constructor(partial: Partial<PostAccessRequestResponseDto> = {}) {
        Object.assign(this, partial);
    }
}