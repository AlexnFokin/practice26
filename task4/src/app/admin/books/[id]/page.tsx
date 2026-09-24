'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditBookPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [form, setForm] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/books/${id}`).then(r => r.json()).then((b) => {
            setForm({
                title: b.title, description: b.description ?? '',
                year: b.year, price: Number(b.price),
                status: b.status, categoryId: b.categoryId, authorId: b.authorId,
            });
        });
        fetch('/api/categories').then(r => r.json()).then(setCategories);
        fetch('/api/authors').then(r => r.json()).then(setAuthors);
    }, [id]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/admin/books/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                year: Number(form.year), price: Number(form.price),
                categoryId: Number(form.categoryId), authorId: Number(form.authorId),
            }),
        });
        if (res.ok) router.push('/admin/books');
    };

    if (!form) return <div className="p-8">Загрузка...</div>;

    return (
        <main className="p-8 max-w-2xl mx-auto">
            <Link href="/admin/books" className="text-blue-600 text-sm">← К списку</Link>
            <h1 className="text-2xl font-bold my-4">Редактировать книгу</h1>

            <form onSubmit={submit} className="space-y-3">
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border p-2 w-full rounded" />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full rounded" rows={3} />

                <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="border p-2 rounded" />
                    <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" />
                </div>

                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border p-2 w-full rounded">
                    <option value="AVAILABLE">Доступна</option>
                    <option value="RENTED">Арендована</option>
                    <option value="SOLD">Продана</option>
                    <option value="ARCHIVED">Архив</option>
                </select>

                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="border p-2 w-full rounded">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select value={form.authorId} onChange={e => setForm({ ...form, authorId: e.target.value })} className="border p-2 w-full rounded">
                    {authors.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
                </select>

                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Сохранить</button>
            </form>
        </main>
    );
}