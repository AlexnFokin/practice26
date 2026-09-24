import { CommentResponseDto } from './CommentResponseDto';

export class CommentTreeDto extends CommentResponseDto {
    replies!: CommentTreeDto[];

    constructor(partial: Partial<CommentTreeDto> = {}) {
        super(partial);
        this.replies = partial.replies ?? [];
    }
}