import { PostResponseDto } from './PostResponseDto';
import { CommentResponseDto } from '../comment/CommentResponseDto';

export class PostWithCommentsDto {
    post!: PostResponseDto;
    comments!: CommentResponseDto[];

    constructor(partial: Partial<PostWithCommentsDto> = {}) {
        Object.assign(this, partial);
    }
}