'use client';
import { useEffect, useState } from 'react';

export default function AdminRentalsPage() {
    const [rentals, setRentals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        fetch('/api/admin/rentals').then(r => r.json()).then(setRentals).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const returnBook = async (id: string) => {
        if (!confirm('Вернуть книгу в библиотеку?')) return;
        await fetch(`/api/admin/rentals/${id}`, { method: 'PATCH' });
        load();
    };

    if (loading) return <div className="p-8">Загрузка...</div>;

    return (
        <main className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Управление арендами</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Книга</th>
                        <th className="text-left p-3">Пользователь</th>
                        <th className="text-left p-3">Период</th>
                        <th className="text-left p-3">До</th>
                        <th className="text-left p-3">Статус</th>
                        <th className="text-left p-3">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map(r => (
                        <tr key={r.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{r.book.title}</td>
                            <td className="p-3">{r.user.email}</td>
                            <td className="p-3">{r.period}</td>
                            <td className="p-3">{new Date(r.expiresAt).toLocaleDateString()}</td>
                            <td className="p-3">{r.status}</td>
                            <td className="p-3">
                                {r.status === 'ACTIVE' && (
                                    <button onClick={() => returnBook(r.id)} className="text-blue-600 text-sm">
                                        Вернуть
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}