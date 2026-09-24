import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postsApi, type Post, type PostImage } from '../../entities/post';
import { Context } from '../../app/providers/StoreProvider';
import { commentsApi, CommentList } from '../../entities/comment';
import { CommentForm } from '../../features/comment/ui/CommentForm';
import { Button } from '../../shared/ui';

interface PostWithComments {
    post: Post;
    comments: Comment[];
}

export function PostPage() {
    const { id } = useParams<{ id: string }>();
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [accessRequested, setAccessRequested] = useState(false);

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        setError(null);

        postsApi
            .get(id)
            .then((res) => {
                const data = res as unknown as PostWithComments;
                if (data.post) {
                    setPost(data.post);
                    setComments(data.comments ?? []);
                } else {
                    setPost(res as unknown as Post);
                    return commentsApi.getByPost(id).then(setComments);
                }
            })
            .catch(() => setError('Пост недоступен'))
            .finally(() => setIsLoading(false));
    }, [id]);

    function handleNewComment(comment: Comment) {
        if (!comment.parentId) {
            setComments((prev) => [...prev, comment]);
            return;
        }

        function insert(list: Comment[], parentId: string): Comment[] {
            return list.map((c) => {
                if (c.id === parentId) {
                    return { ...c, replies: [...(c.replies ?? []), comment] };
                }
                if (c.replies?.length > 0) {
                    return { ...c, replies: insert(c.replies, parentId) };
                }
                return c;
            });
        }

        setComments((prev) => insert(prev, comment.parentId!));
    }

    async function handleDelete() {
        if (!post) return;
        if (!window.confirm('Удалить пост?')) return;

        setIsDeleting(true);
        try {
            await postsApi.delete(post.id);
            navigate('/');
        } catch {
            alert('Не удалось удалить пост');
            setIsDeleting(false);
        }
    }

    async function handleRequestAccess() {
        if (!post) return;
        try {
            await postsApi.requestAccess(post.id);
            setAccessRequested(true);
        } catch {
            alert('Не удалось отправить заявку');
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center py-16 text-center">
                <p className="text-lg font-medium text-gray-900">Пост недоступен</p>
                <p className="mt-1 text-sm text-gray-500">
                    Возможно, он удалён или у вас нет доступа
                </p>
                <Link
                    to="/"
                    className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                    На главную
                </Link>
            </div>
        );
    }

    const isAuthor = store.isAuth && post.authorId === store.user.id;

    return (
        <article>
            <Link
                to="/"
                className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-900"
            >
                ← Назад к постам
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>

                {post.tags.map((tag) => (
                    <Link
                        key={tag}
                        to={`/?tags=${tag}`}
                        className="rounded-full bg-gray-100 px-2 py-0.5 hover:bg-gray-200"
                    >
                        #{tag}
                    </Link>
                ))}

                {!post.isPublic && (
                    <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-800">
                        Приватный
                    </span>
                )}
                {post.isHidden && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-gray-700">
                        Скрытый
                    </span>
                )}
            </div>

            {post.images.length > 0 && (
                <div
                    className={`mt-6 grid gap-3 ${post.images.length === 1 ? '' : 'sm:grid-cols-2'
                        }`}
                >
                    {post.images.map((img: PostImage, i: number) => (
                        <img
                            key={i}
                            src={`${import.meta.env.VITE_API_URL}${img.url}`}
                            alt={img.alt ?? post.title}
                            className="w-full rounded-lg object-cover"
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-800">
                {post.content}
            </div>

            {isAuthor && (
                <div className="mt-6 flex gap-2">
                    <Link to={`/posts/${post.id}/edit`}>
                        <Button variant="secondary">Редактировать</Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </div>
            )}

            {!post.isPublic && !isAuthor && !accessRequested && (
                <button
                    onClick={handleRequestAccess}
                    className="mt-6 rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600"
                >
                    Запросить доступ
                </button>
            )}

            {accessRequested && (
                <p className="mt-6 text-sm text-green-600">
                    Заявка отправлена. Дождитесь одобрения автора.
                </p>
            )}

            <section className="mt-10 border-t border-gray-200 pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Комментарии ({comments.length})
                </h2>

                <CommentList
                    comments={comments}
                    postId={post.id}
                    onReply={handleNewComment}
                />

                <div className="mt-8">
                    {store.isAuth ? (
                        <CommentForm postId={post.id} onSuccess={handleNewComment} />
                    ) : (
                        <p className="text-sm text-gray-500">
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Войдите
                            </Link>
                            , чтобы оставить комментарий
                        </p>
                    )}
                </div>
            </section>
        </article>
    );
}