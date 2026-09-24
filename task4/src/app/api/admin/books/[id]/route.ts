import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') return null;
    return session;
}

const patchSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    year: z.number().int().optional(),
    price: z.number().positive().optional(),
    status: z.enum(['AVAILABLE', 'RENTED', 'SOLD', 'ARCHIVED']).optional(),
    categoryId: z.number().int().optional(),
    authorId: z.number().int().optional(),
    coverUrl: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const book = await prisma.book.update({
            where: { id: Number(id) },
            data: parsed.data,
        });
        return NextResponse.json(book);
    } catch {
        return NextResponse.json({ error: 'Книга не найдена' }, { status: 404 });
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    try {
        await prisma.book.delete({ where: { id: Number(id) } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Книга не найдена' }, { status: 404 });
    }
}