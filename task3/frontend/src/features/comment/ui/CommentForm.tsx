import { useState } from 'react';
import { commentsApi } from '../../../entities/comment';
import { Textarea, Button } from '../../../shared/ui';

interface Props {
    postId: string;
    parentId?: string | null;
    onSuccess: (comment: Comment) => void;
    onCancel?: () => void;
}

export function CommentForm({ postId, parentId = null, onSuccess, onCancel }: Props) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!content.trim()) {
            setError('Комментарий не может быть пустым');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const comment = await commentsApi.create({
                postId,
                content: content.trim(),
                parentId,
            });
            setContent('');
            onSuccess(comment);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? 'Не удалось отправить комментарий';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentId ? 'Ответить...' : 'Написать комментарий...'}
                rows={3}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : parentId ? 'Ответить' : 'Отправить'}
                </Button>
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Отмена
                    </Button>
                )}
            </div>
        </form>
    );
}