export class CommentResponseDto {
    id!: string;
    postId!: string;
    authorId!: string;
    content!: string;
    parentId!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(partial: Partial<CommentResponseDto> = {}) {
        Object.assign(this, partial);
    }
}