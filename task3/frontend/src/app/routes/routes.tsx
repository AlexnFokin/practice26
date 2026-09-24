import type { ReactNode } from 'react';
import { LoginPage } from '../../pages/login/LoginPage';
import { NotFoundPage } from '../../pages/notfound/NotFoundPage';
import { PostsPage } from '../../pages/posts/PostsPage';
import { PostPage } from '../../pages/post/PostPage';
import { CreatePostPage } from '../../pages/create-post/CreatePostPage';
import { EditPostPage } from '../../pages/edit-post/EditPostPage';

export interface AppRoute {
    path: string;
    element: ReactNode;
    authOnly?: boolean;
}

export const routes: AppRoute[] = [
    {
        path: '/',
        element: <PostsPage />,
    },
    {
        path: '/posts/:id',
        element: <PostPage />,
    },
    {
        path: '/posts/new',
        element: <CreatePostPage />,
        authOnly: true,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/posts/:id/edit',
        element: <EditPostPage />,
        authOnly: true,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];