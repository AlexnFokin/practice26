'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white shadow px-6 py-3 flex gap-4 items-center">
            <Link href="/" className="font-bold">🌍 Дневник</Link>
            <Link href="/">Лента</Link>

            {session ? (
                <>
                    <Link href="/my">Мои</Link>
                    <Link href="/trips/new">+ Новое</Link>
                    <span className="ml-auto text-sm text-gray-600">{session.user?.name}</span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-red-500 text-sm"
                    >
                        Выйти
                    </button>
                </>
            ) : (
                <>
                    <Link href="/login" className="ml-auto">Войти</Link>
                    <Link href="/register">Регистрация</Link>
                </>
            )}
        </nav>
    );
}