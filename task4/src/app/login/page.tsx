'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('admin@test.local');
    const [password, setPassword] = useState('admin123');
    const [err, setErr] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res?.error) setErr('Неверный email или пароль');
        else router.push('/');
    };

    return (
        <form onSubmit={onSubmit} className="p-8 max-w-md mx-auto space-y-3">
            <h1 className="text-2xl font-bold">Вход</h1>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="border p-2 w-full rounded"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="пароль"
                className="border p-2 w-full rounded"
            />
            {err && <div className="text-red-600">{err}</div>}
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Войти</button>
            <div className="text-sm text-center">
                Нет аккаунта? <Link href="/register" className="text-blue-600">Зарегистрироваться</Link>
            </div>
        </form>
    );
}