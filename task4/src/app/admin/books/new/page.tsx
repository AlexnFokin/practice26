'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBookPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: '', description: '', year: new Date().getFullYear(),
        price: 10, categoryId: '', authorId: '',
    });
    const [err, setErr] = useState('');

    useEffect(() => {
        fetch('/api/categories').then(r => r.json()).then(setCategories);
        fetch('/api/authors').then(r => r.json()).then(setAuthors);
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        const res = await fetch('/api/admin/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                year: Number(form.year),
                price: Number(form.price),
                categoryId: Number(form.categoryId),
                authorId: Number(form.authorId),
            }),
        });
        if (res.ok) router.push('/admin/books');
        else { const d = await res.json(); setErr(JSON.stringify(d.error)); }
    };

    return (
        <main className="p-8 max-w-2xl mx-auto">
            <Link href="/admin/books" className="text-blue-600 text-sm">← К списку</Link>
            <h1 className="text-2xl font-bold my-4">Новая книга</h1>

            <form onSubmit={submit} className="space-y-3">
                <input required placeholder="Название" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="border p-2 w-full rounded" />

                <textarea placeholder="Описание" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="border p-2 w-full rounded" rows={3} />

                <div className="grid grid-cols-2 gap-3">
                    <input required type="number" placeholder="Год" value={form.year}
                        onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                        className="border p-2 rounded" />
                    <input required type="number" step="0.01" placeholder="Цена" value={form.price}
                        onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                        className="border p-2 rounded" />
                </div>

                <select required value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="border p-2 w-full rounded">
                    <option value="">— Категория —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select required value={form.authorId}
                    onChange={e => setForm({ ...form, authorId: e.target.value })}
                    className="border p-2 w-full rounded">
                    <option value="">— Автор —</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
                </select>

                {err && <div className="text-red-600">{err}</div>}

                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Создать</button>
            </form>
        </main>
    );
}