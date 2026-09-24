'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password }),
        });
        const data = await res.json();
        if (!res.ok) setError(data.error || 'Ошибка');
        else router.push('/login');
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Регистрация</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border p-2 rounded mb-2"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-2 rounded mb-2"
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border p-2 rounded mb-4"
            />
            <button className="bg-blue-600 text-white w-full py-2 rounded">Создать</button>
            <p className="text-sm mt-3">
                Уже есть? <Link href="/login" className="text-blue-600">Войти</Link>
            </p>
        </form>
    );
}