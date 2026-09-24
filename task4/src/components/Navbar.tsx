'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
    const { data: session } = useSession();
    const role = (session?.user as any)?.role;

    return (
        <nav className="border-b px-6 py-3 flex items-center gap-4">
            <Link href="/" className="font-bold">📚 Book Service</Link>
            <div className="flex-1" />
            {session ? (
                <>
                    <Link href="/my/rentals">Мои аренды</Link>
                    <Link href="/my/notifications">Уведомления</Link>
                    {role === 'ADMIN' && <Link href="/admin/books">Админка</Link>}
                    <span className="text-sm text-gray-600">{session.user?.email}</span>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600">Выйти</button>
                </>
            ) : (
                <>
                    <Link href="/login">Войти</Link>
                    <Link href="/register">Регистрация</Link>
                </>
            )}
        </nav>
    );
}