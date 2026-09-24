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

export default function CatalogPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('');
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [sort, setSort] = useState('title:asc');

    useEffect(() => {
        fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => { });
        fetch('/api/authors').then(r => r.json()).then(setAuthors).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        setError('');
        const qs = new URLSearchParams({ category, author, yearFrom, yearTo, sort }).toString();

        fetch(`/api/books?${qs}`)
            .then(async (r) => {
                if (!r.ok) {
                    const text = await r.text();
                    throw new Error(`HTTP ${r.status}: ${text.slice(0, 200)}`);
                }
                return r.json();
            })
            .then((data) => setBooks(Array.isArray(data) ? data : []))
            .catch((e) => {
                console.error('Ошибка загрузки книг:', e);
                setError(e.message);
                setBooks([]);
            })
            .finally(() => setLoading(false));
    }, [category, author, yearFrom, yearTo, sort]);

    return (
        <main className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Каталог книг</h1>

            <div className="flex gap-3 flex-wrap mb-6">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
                    <option value="">Все категории</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select value={author} onChange={(e) => setAuthor(e.target.value)} className="border p-2 rounded">
                    <option value="">Все авторы</option>
                    {authors.map((a) => (
                        <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                    ))}
                </select>

                <input type="number" placeholder="Год от" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className="border p-2 rounded w-28" />
                <input type="number" placeholder="Год до" value={yearTo} onChange={(e) => setYearTo(e.target.value)} className="border p-2 rounded w-28" />

                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
                    <option value="title:asc">Название ↑</option>
                    <option value="title:desc">Название ↓</option>
                    <option value="year:asc">Год ↑</option>
                    <option value="year:desc">Год ↓</option>
                    <option value="price:asc">Цена ↑</option>
                    <option value="price:desc">Цена ↓</option>
                </select>
            </div>

            {loading && <div className="text-gray-500">Загрузка...</div>}
            {error && <div className="text-red-600 mb-4 p-3 border border-red-300 rounded">Ошибка: {error}</div>}
            {!loading && !error && books.length === 0 && <div className="text-gray-500">Книг не найдено.</div>}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {books.map((b) => (
                    <Link key={b.id} href={`/books/${b.id}`} className="border rounded p-4 hover:shadow transition flex flex-col">
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-sm text-gray-600">{b.author.firstName} {b.author.lastName}</div>
                        <div className="text-sm">{b.year}</div>
                        <div className="text-xs text-gray-500">{b.category.name}</div>
                        <div className="mt-auto pt-2 font-bold">{Number(b.price).toFixed(2)} ₽</div>
                        <div className={`text-xs mt-1 ${b.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}`}>
                            {b.status === 'AVAILABLE' ? 'Доступна' :
                                b.status === 'RENTED' ? 'Арендована' :
                                    b.status === 'SOLD' ? 'Продана' : b.status}
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}