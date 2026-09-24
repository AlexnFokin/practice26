'use client';
import { useRouter } from 'next/navigation';

export default function DeleteTripButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDelete() {
        if (!confirm('Удалить путешествие?')) return;
        const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
        if (res.ok) router.push('/my');
        else alert('Не удалось удалить');
    }

    return (
        <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
            Удалить
        </button>
    );
}