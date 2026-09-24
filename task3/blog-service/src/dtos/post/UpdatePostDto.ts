import { PostImage } from "@/types/post/postImage";

export class UpdatePostDto {
    title?: string;
    content?: string;
    isPublic?: boolean;
    isHidden?: boolean;
    tags?: string[];
    images?: PostImage
}