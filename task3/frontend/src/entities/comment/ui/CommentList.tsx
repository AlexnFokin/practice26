import type { Comment } from '../model/types';
import { CommentItem } from './CommentItem';

interface Props {
    comments: Comment[];
    postId: string;
    onReply: (comment: Comment) => void;
}

export function CommentList({ comments, postId, onReply }: Props) {
    if (comments.length === 0) {
        return <p className="text-sm text-gray-500">Комментариев пока нет</p>;
    }

    return (
        <div className="space-y-4">
            {comments.map((c) => (
                <CommentItem
                    key={c.id}
                    comment={c}
                    postId={postId}
                    onReply={onReply}
                />
            ))}
        </div>
    );
}