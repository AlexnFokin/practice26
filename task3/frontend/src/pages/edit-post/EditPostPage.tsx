import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../app/providers/StoreProvider';
import { postsApi } from '../../entities/post';
import { Input, Textarea, Button } from '../../shared/ui';

export function EditPostPage() {
    const { id } = useParams<{ id: string }>();
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isHidden, setIsHidden] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<{ url: string; alt?: string; order: number }[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatedId, setUpdatedId] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        postsApi
            .get(id)
            .then((res) => {
                // если бэк отдаёт { post, comments } — берём post
                const post = (res as any).post ?? res;
                setTitle(post.title);
                setContent(post.content);
                setTags((post.tags ?? []).join(', '));
                setIsPublic(post.isPublic);
                setIsHidden(post.isHidden);
                setExistingImages(post.images ?? []);
            })
            .catch(() => setError('Пост недоступен'))
            .finally(() => setIsLoading(false));
    }, [id]);

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files ?? []);
        setImages((prev) => [...prev, ...selected]);
        e.target.value = '';
    }

    function removeNewImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    function removeExistingImage(index: number) {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const form = new FormData();
            form.append('title', title);
            form.append('content', content);
            form.append('isPublic', String(isPublic));
            form.append('isHidden', String(isHidden));

            const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
            form.append('tags', JSON.stringify(parsedTags));

            // оставляем старые картинки, которые пользователь не удалил
            form.append('existingImages', JSON.stringify(existingImages));

            images.forEach((file) => form.append('images', file));

            await postsApi.update(id, form);
            setUpdatedId(id);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? 'Не удалось обновить пост';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (updatedId) {
        return <Navigate to={`/posts/${updatedId}`} replace />;
    }

    if (isLoading) return <div>Загрузка...</div>;

    if (error && !title) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Редактировать пост</h1>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={255}
                />

                <Textarea
                    label="Текст"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={10}
                />

                <Input
                    label="Теги"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="node, react, js"
                />

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        Публичный
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={isHidden}
                            onChange={(e) => setIsHidden(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        Скрытый
                    </label>
                </div>

                {existingImages.length > 0 && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Текущие картинки
                        </label>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {existingImages.map((img, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${img.url}`}
                                        alt={img.alt ?? ''}
                                        className="h-24 w-full rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Добавить картинки
                    </label>
                    <div
                        onClick={() => inputRef.current?.click()}
                        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 hover:border-blue-400 hover:bg-blue-50"
                    >
                        Нажмите, чтобы выбрать картинки
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        className="hidden"
                    />

                    {images.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {images.map((file, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        className="h-24 w-full rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(i)}
                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    );
}