import { useState } from 'react';
import type { Comment } from '../model/types';
import { CommentForm } from '../../../features/comment/ui/CommentForm';

interface Props {
    comment: Comment;
    postId: string;
    onReply: (comment: Comment) => void;
}

export function CommentItem({ comment, postId, onReply }: Props) {
    const [isReplying, setIsReplying] = useState(false);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{comment.authorId.slice(0, 8)}…</span>
                <span>{new Date(comment.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>

            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                {comment.content}
            </p>

            <button
                type="button"
                onClick={() => setIsReplying((v) => !v)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
                {isReplying ? 'Отмена' : 'Ответить'}
            </button>

            {isReplying && (
                <div className="mt-3">
                    <CommentForm
                        postId={postId}
                        parentId={comment.id}
                        onSuccess={(newComment) => {
                            setIsReplying(false);
                            onReply(newComment);
                        }}
                        onCancel={() => setIsReplying(false)}
                    />
                </div>
            )}

            {comment.replies?.length > 0 && (
                <div className="mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}