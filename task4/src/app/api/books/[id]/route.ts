import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await prisma.book.findUnique({
        where: { id: Number(id) },
        include: { author: true, category: true },
    });
    if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(book);
}