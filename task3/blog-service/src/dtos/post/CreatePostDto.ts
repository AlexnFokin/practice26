import { PostImage } from "@/types/post/postImage";

export class CreatePostDto {
    title!: string;
    content!: string;
    isPublic?: boolean;
    isHidden?: boolean;
    tags?: string[];
    images?: PostImage;
}