import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PostCard, postsApi, type Post } from '../../entities/post';

export function PostsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // теги в input (локально, пока не нажали «Применить»)
    const [tagsInput, setTagsInput] = useState(searchParams.get('tags') ?? '');

    // читаем из URL
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortOrder = searchParams.get('sortOrder') ?? 'desc';

    // синхронизируем input с URL, если URL изменился извне
    useEffect(() => {
        setTagsInput(searchParams.get('tags') ?? '');
    }, [searchParams]);

    // загрузка постов
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        postsApi
            .list({ page, limit: 10, tags, sortBy, sortOrder })
            .then((data) => {
                setPosts(data.posts);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            })
            .catch(() => setError('Не удалось загрузить посты'))
            .finally(() => setIsLoading(false));
    }, [page, searchParams]);

    function applyTags() {
        const next = new URLSearchParams(searchParams);
        const clean = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        if (clean.length > 0) {
            next.set('tags', clean.join(','));
        } else {
            next.delete('tags');
        }

        setPage(1);
        setSearchParams(next);
    }

    function clearTags() {
        setTagsInput('');
        const next = new URLSearchParams(searchParams);
        next.delete('tags');
        setPage(1);
        setSearchParams(next);
    }

    function changeSort(value: string) {
        const [by, order] = value.split(':');
        const next = new URLSearchParams(searchParams);
        next.set('sortBy', by);
        next.set('sortOrder', order);
        setPage(1);
        setSearchParams(next);
    }

    return (
        <div>
            {/* Заголовок */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Все посты</h1>
                <span className="text-sm text-gray-500">Всего: {total}</span>
            </div>

            {/* Панель фильтров */}
            <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
                {/* Теги */}
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[200px] flex-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Теги (через запятую)
                        </label>
                        <input
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    applyTags();
                                }
                            }}
                            placeholder="node, react"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={applyTags}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Применить
                    </button>

                    {tags.length > 0 && (
                        <button
                            onClick={clearTags}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                            Сбросить
                        </button>
                    )}
                </div>

                {/* Сортировка */}
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Сортировка
                        </label>
                        <select
                            value={`${sortBy}:${sortOrder}`}
                            onChange={(e) => changeSort(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="createdAt:desc">Сначала новые</option>
                            <option value="createdAt:asc">Сначала старые</option>
                            <option value="title:asc">По заголовку (А-Я)</option>
                            <option value="title:desc">По заголовку (Я-А)</option>
                            <option value="updatedAt:desc">Недавно обновлённые</option>
                            <option value="updatedAt:asc">Давно обновлённые</option>
                        </select>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-500">Активные теги:</span>
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Посты */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <p className="text-lg font-medium text-gray-900">Ошибка</p>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <button
                        onClick={() => setPage(1)}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        Повторить
                    </button>
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <p className="text-lg font-medium text-gray-900">
                        {tags.length > 0 ? 'По таким тегам ничего не найдено' : 'Постов пока нет'}
                    </p>
                    {tags.length > 0 ? (
                        <button
                            onClick={clearTags}
                            className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Сбросить фильтры
                        </button>
                    ) : (
                        <Link
                            to="/posts/new"
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Создать пост
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Назад
                    </button>
                    <span className="text-sm text-gray-600">
                        {page} из {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Вперёд
                    </button>
                </div>
            )}
        </div>
    );
}