export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    replies: Comment[];
}