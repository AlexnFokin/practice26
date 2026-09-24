import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Получить одно путешествие по ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID путешествия (cuid)
 *         example: cmu86i142000420vjwk693s0f
 *     responses:
 *       200:
 *         description: Путешествие найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: { user: { select: { name: true } } },
    });
    if (!trip) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    return NextResponse.json(trip);
}

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Удалить путешествие (только автор)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешно удалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Нет доступа (не автор)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    if (trip.userId !== (session.user as any).id) {
        return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }

    await prisma.trip.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}