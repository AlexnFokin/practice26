export interface PostImage {
    url: string;
    alt?: string;
    order?: number;
    size?: number;
    mimetype?: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    isPublic: boolean;
    isHidden: boolean;
    tags: string[];
    images: PostImage[];
    createdAt: string;
    updatedAt: string;
}

export interface PostsResponse {
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PostWithComments {
    post: Post;
    comments: Comment[];
}