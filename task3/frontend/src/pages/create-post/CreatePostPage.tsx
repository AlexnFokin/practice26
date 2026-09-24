import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { postsApi } from '../../entities/post';
import { Button, Input, Textarea } from '../../shared/ui';

export function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdId, setCreatedId] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files ?? []);
        setImages((prev) => [...prev, ...selected]);
        e.target.value = '';
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError('Заголовок и текст обязательны');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const form = new FormData();
            form.append('title', title);
            form.append('content', content);
            form.append('isPublic', String(isPublic));

            const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
            if (parsedTags.length > 0) {
                form.append('tags', JSON.stringify(parsedTags));
            }

            images.forEach((file) => form.append('images', file));

            const post = await postsApi.create(form);
            setCreatedId(post.id);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? 'Не удалось создать пост';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (createdId) {
        return <Navigate to={`/posts/${createdId}`} replace />;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Создать пост</h1>

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
                    placeholder="О чём пост?"
                />

                <Textarea
                    label="Текст"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={10}
                    placeholder="Расскажите историю..."
                />

                <Input
                    label="Теги"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="node, react, js"
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                        Публичный пост
                    </label>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Картинки
                    </label>

                    <div
                        onClick={() => inputRef.current?.click()}
                        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 transition hover:border-blue-400 hover:bg-blue-50"
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
                                        onClick={() => removeImage(i)}
                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                        aria-label="Удалить"
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
                        {isSubmitting ? 'Отправка...' : 'Создать'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    );
}