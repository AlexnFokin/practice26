import { PostImage } from "@/types/post/postImage";

export class PostResponseDto {
    id!: string;
    title!: string;
    content!: string;
    authorId!: string;
    isPublic!: boolean;
    isHidden!: boolean;
    tags!: string[];
    images!: PostImage[];
    createdAt!: Date;
    updatedAt!: Date;

    constructor(partial: Partial<PostResponseDto> = {}) {
        Object.assign(this, partial);
    }
}