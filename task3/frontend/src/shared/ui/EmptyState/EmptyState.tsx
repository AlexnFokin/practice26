import type { ReactNode } from 'react';

interface Props {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ title, description, action }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-gray-900" > {title} </p>
            {description && <p className="mt-1 text-sm text-gray-500" > {description} </p>}
            {action && <div className="mt-4" > {action} </div>}
        </div>
    );
}