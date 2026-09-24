'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Book = {
    id: number;
    title: string;
    year: number;
    price: string | number;
    status: string;
    author: { firstName: string; lastName: string };
    category: { name: string };
};

const STATUS_LABELS: Record<string, string> = {
    AVAILABLE: 'Доступна',
    RENTED: 'Арендована',
    SOLD: 'Продана',
    ARCHIVED: 'Архив',
};

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPrice, setEditingPrice] = useState<number | null>(null);
    const [priceDraft, setPriceDraft] = useState('');

    const load = () => {
        setLoading(true);
        fetch('/api/admin/books')
            .then(async (r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(setBooks)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: number, status: string) => {
        await fetch(`/api/admin/books/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        load();
    };

    const savePrice = async (id: number) => {
        const price = Number(priceDraft);
        if (!price || price <= 0) return;
        await fetch(`/api/admin/books/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price }),
        });
        setEditingPrice(null);
        load();
    };

    const remove = async (id: number, title: string) => {
        if (!confirm(`Удалить книгу «${title}»?`)) return;
        await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
        load();
    };

    if (loading) return <div className="p-8">Загрузка...</div>;
    if (error) return <div className="p-8 text-red-600">Ошибка: {error}</div>;

    return (
        <main className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление книгами</h1>
                <Link href="/admin/books/new" className="bg-green-600 text-white px-4 py-2 rounded">
                    + Добавить книгу
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-3">ID</th>
                            <th className="text-left p-3">Название</th>
                            <th className="text-left p-3">Автор</th>
                            <th className="text-left p-3">Год</th>
                            <th className="text-left p-3">Цена</th>
                            <th className="text-left p-3">Статус</th>
                            <th className="text-left p-3">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(b => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{b.id}</td>
                                <td className="p-3">{b.title}</td>
                                <td className="p-3">{b.author.firstName} {b.author.lastName}</td>
                                <td className="p-3">{b.year}</td>

                                <td className="p-3">
                                    {editingPrice === b.id ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={priceDraft}
                                                onChange={(e) => setPriceDraft(e.target.value)}
                                                className="border p-1 rounded w-24"
                                                autoFocus
                                            />
                                            <button onClick={() => savePrice(b.id)} className="text-green-600 text-sm">✓</button>
                                            <button onClick={() => setEditingPrice(null)} className="text-gray-500 text-sm">✕</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setEditingPrice(b.id); setPriceDraft(String(b.price)); }}
                                            className="hover:underline"
                                        >
                                            {Number(b.price).toFixed(2)} ₽ ✎
                                        </button>
                                    )}
                                </td>

                                <td className="p-3">
                                    <select
                                        value={b.status}
                                        onChange={(e) => updateStatus(b.id, e.target.value)}
                                        className="border p-1 rounded"
                                    >
                                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </td>

                                <td className="p-3">
                                    <div className="flex gap-3">
                                        <Link href={`/admin/books/${b.id}`} className="text-blue-600 text-sm">Редактировать</Link>
                                        <button onClick={() => remove(b.id, b.title)} className="text-red-600 text-sm">Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}