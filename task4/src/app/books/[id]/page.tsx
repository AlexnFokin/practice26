'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Period = 'TWO_WEEKS' | 'ONE_MONTH' | 'THREE_MONTHS';

export default function BookPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: session } = useSession();
    const [book, setBook] = useState<any>(null);
    const [showRentModal, setShowRentModal] = useState(false);
    const [period, setPeriod] = useState<Period>('TWO_WEEKS');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const load = () =>
        fetch(`/api/books/${id}`).then(r => r.json()).then(setBook);

    useEffect(() => { load(); }, [id]);

    if (!book) return <div className="p-8">Загрузка...</div>;
    if (book.error) return <div className="p-8">Книга не найдена</div>;

    const requireAuth = () => {
        if (!session) { router.push('/login'); return false; }
        return true;
    };

    const onBuy = async () => {
        if (!requireAuth()) return;
        setError(''); setMsg('');
        const res = await fetch(`/api/books/${id}/buy`, { method: 'POST' });
        if (res.ok) { setMsg('Куплено!'); load(); }
        else { const d = await res.json(); setError(d.error); }
    };

    const onRent = async () => {
        if (!requireAuth()) return;
        setError(''); setMsg('');
        const res = await fetch(`/api/books/${id}/rent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ period }),
        });
        if (res.ok) { setMsg('Арендовано!'); setShowRentModal(false); load(); }
        else { const d = await res.json(); setError(d.error); }
    };

    const price = Number(book.price);
    const rentPrice = { TWO_WEEKS: price * 0.15, ONE_MONTH: price * 0.25, THREE_MONTHS: price * 0.6 }[period];

    return (
        <main className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <div className="text-gray-600 mt-1">
                {book.author.firstName} {book.author.lastName}, {book.year}
            </div>
            <div className="text-sm text-gray-500">{book.category.name}</div>
            <p className="mt-4">{book.description ?? 'Описание отсутствует'}</p>
            <div className="mt-6 text-2xl font-bold">{price.toFixed(2)} ₽</div>

            {msg && <div className="mt-3 text-green-600">{msg}</div>}
            {error && <div className="mt-3 text-red-600">{error}</div>}

            {book.status === 'AVAILABLE' ? (
                <div className="mt-4 flex gap-3">
                    <button onClick={onBuy} className="bg-blue-600 text-white px-4 py-2 rounded">Купить</button>
                    <button onClick={() => setShowRentModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">Арендовать</button>
                </div>
            ) : (
                <div className="mt-4 text-red-600">Недоступна: {book.status}</div>
            )}

            {showRentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setShowRentModal(false)}>
                    <div className="bg-white p-6 rounded max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Арендовать книгу</h2>
                        <select value={period} onChange={e => setPeriod(e.target.value as Period)} className="border p-2 w-full rounded mb-3">
                            <option value="TWO_WEEKS">2 недели</option>
                            <option value="ONE_MONTH">1 месяц</option>
                            <option value="THREE_MONTHS">3 месяца</option>
                        </select>
                        <div className="text-lg font-bold mb-4">К оплате: {rentPrice.toFixed(2)} ₽</div>
                        <div className="flex gap-2">
                            <button onClick={onRent} className="bg-green-600 text-white px-4 py-2 rounded flex-1">Подтвердить</button>
                            <button onClick={() => setShowRentModal(false)} className="border px-4 py-2 rounded">Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}