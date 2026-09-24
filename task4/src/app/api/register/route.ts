import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

export async function POST(req: Request) {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
        return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (exists) {
        return NextResponse.json({ error: 'Email занят' }, { status: 409 });
    }

    const user = await prisma.user.create({
        data: {
            email: parsed.data.email,
            name: parsed.data.name,
            passwordHash: await bcrypt.hash(parsed.data.password, 10),
        },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}