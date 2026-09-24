'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        if (res?.error) setError('Неверный email или пароль');
        else router.push('/');
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Вход</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
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
            <button className="bg-blue-600 text-white w-full py-2 rounded">Войти</button>
            <p className="text-sm mt-3">
                Нет аккаунта? <Link href="/register" className="text-blue-600">Зарегистрируйся</Link>
            </p>
        </form>
    );
}