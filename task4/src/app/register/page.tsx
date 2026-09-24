'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [err, setErr] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });
        if (!res.ok) {
            const data = await res.json();
            setErr(data.error ?? 'Ошибка регистрации');
            return;
        }
        await signIn('credentials', { email, password, redirect: false });
        router.push('/');
    };

    return (
        <form onSubmit={onSubmit} className="p-8 max-w-md mx-auto space-y-3">
            <h1 className="text-2xl font-bold">Регистрация</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="border p-2 w-full rounded" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="border p-2 w-full rounded" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="пароль (мин. 6)" className="border p-2 w-full rounded" />
            {err && <div className="text-red-600">{err}</div>}
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Создать аккаунт</button>
            <div className="text-sm text-center">
                Уже есть аккаунт? <Link href="/login" className="text-blue-600">Войти</Link>
            </div>
        </form>
    );
}