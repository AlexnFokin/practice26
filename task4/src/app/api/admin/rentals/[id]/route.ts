import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) return NextResponse.json({ error: 'Аренда не найдена' }, { status: 404 });

    await prisma.$transaction([
        prisma.rental.update({
            where: { id },
            data: { status: 'RETURNED', returnedAt: new Date() },
        }),
        prisma.book.update({
            where: { id: rental.bookId },
            data: { status: 'AVAILABLE' },
        }),
    ]);

    return NextResponse.json({ ok: true });
}