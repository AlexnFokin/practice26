import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rentals = await prisma.rental.findMany({
        where: { userId: (session.user as any).id },
        include: { book: { include: { author: true } } },
        orderBy: { startedAt: 'desc' },
    });
    return NextResponse.json(rentals);
}