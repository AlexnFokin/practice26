'use client';
import { useEffect, useState } from 'react';

export default function MyRentalsPage() {
    const [rentals, setRentals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/me/rentals')
            .then(r => r.json())
            .then(setRentals)
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Мои аренды</h1>
            {loading && <div className="text-gray-500">Загрузка...</div>}
            {!loading && rentals.length === 0 && <div className="text-gray-500">Пока ничего не арендовано.</div>}
            <div className="space-y-3">
                {rentals.map(r => (
                    <div key={r.id} className="border rounded p-4 flex justify-between">
                        <div>
                            <div className="font-semibold">{r.book.title}</div>
                            <div className="text-sm text-gray-600">{r.book.author.firstName} {r.book.author.lastName}</div>
                            <div className="text-sm">до {new Date(r.expiresAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold">{Number(r.priceAtMoment).toFixed(2)} ₽</div>
                            <div className="text-sm">{r.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}