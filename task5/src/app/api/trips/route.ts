import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Список всех путешествий (публично)
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Массив путешествий, отсортированный по дате создания
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 */
export async function GET() {
    const trips = await prisma.trip.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
    });
    return NextResponse.json(trips);
}

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Создать новое путешествие
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripInput'
 *     responses:
 *       200:
 *         description: Созданное путешествие
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await req.json();

    const trip = await prisma.trip.create({
        data: {
            title: body.title,
            description: body.description || null,
            latitude: Number(body.latitude),
            longitude: Number(body.longitude),
            address: body.address || null,
            image: body.image || null,
            cost: body.cost ? Number(body.cost) : null,
            heritage: body.heritage || null,
            places: body.places || null,
            traffic: Number(body.traffic) || 3,
            safety: Number(body.safety) || 3,
            crowdedness: Number(body.crowdedness) || 3,
            vegetation: Number(body.vegetation) || 3,
            userId: (session.user as any).id,
        },
    });

    return NextResponse.json(trip);
}