'use client';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/me/notifications').then(r => r.json()).then(setItems);
    }, []);

    return (
        <main className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Уведомления</h1>
            {items.length === 0 && <div className="text-gray-500">Пока нет уведомлений.</div>}
            <div className="space-y-2">
                {items.map(n => (
                    <div key={n.id} className="border rounded p-3">
                        <div>{n.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(n.sentAt).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </main>
    );
}