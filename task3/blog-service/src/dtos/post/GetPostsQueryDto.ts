export type GetPostsQueryDto = {
    page: number;
    limit: number;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};