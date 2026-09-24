export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

export enum AccessStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export interface CreatePostDto {
    title: string;
    content: string;
    status?: PostStatus;
    isPublic?: boolean;
    isHidden?: boolean;
    tags?: string[];
}

export interface AccessRequestDto {
    postId: string;
    userId: string;
    status: AccessStatus;
}