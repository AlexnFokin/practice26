import { TextareaHTMLAttributes, forwardRef } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ label, error, className = '', ...rest }, ref) => (
        <div>
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    } ${className}`}
                {...rest}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    ),
);

Textarea.displayName = 'Textarea';