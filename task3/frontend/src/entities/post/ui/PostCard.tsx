import { Link } from 'react-router-dom';
import type { Post } from '../model/types';

export function PostCard({ post }: { post: Post }) {
    const cover = post.images?.[0]?.url;
    const coverUrl = `${import.meta.env.VITE_API_URL}${cover}`;
    return (
        <Link
            to={`/posts/${post.id}`}
            className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
        >
            {cover ? (
                <img
                    src={coverUrl}
                    alt={post.images[0].alt ?? post.title}
                    className="h-48 w-full object-cover transition group-hover:scale-105"
                />
            ) : (
                <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-gray-400">
                    Нет изображения
                </div>
            )}

            <div className="p-4">
                <h2 className="line-clamp-1 text-lg font-semibold text-gray-900">
                    {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.content}</p>

                {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                    {!post.isPublic && (
                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-800">
                            Приватный
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}