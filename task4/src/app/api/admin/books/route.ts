import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') return null;
    return session;
}

export async function GET() {
    if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const books = await prisma.book.findMany({
        include: { author: true, category: true },
        orderBy: { id: 'desc' },
    });
    return NextResponse.json(books);
}

const createSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    year: z.number().int(),
    price: z.number().positive(),
    categoryId: z.number().int(),
    authorId: z.number().int(),
    coverUrl: z.string().optional(),
    isbn: z.string().optional(),
});

export async function POST(req: Request) {
    if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const book = await prisma.book.create({ data: parsed.data });
    return NextResponse.json(book, { status: 201 });
}