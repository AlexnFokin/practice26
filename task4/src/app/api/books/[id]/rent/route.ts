import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rentBook, type RentalPeriodKey } from '@/lib/rental';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { period } = await req.json() as { period: RentalPeriodKey };

    try {
        const rental = await rentBook((session.user as any).id, Number(id), period);
        return NextResponse.json(rental, { status: 201 });
    } catch (e: any) {
        if (e.message === 'BOOK_NOT_FOUND') return NextResponse.json({ error: 'Книга не найдена' }, { status: 404 });
        if (e.message === 'NOT_AVAILABLE') return NextResponse.json({ error: 'Книга недоступна' }, { status: 409 });
        return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
    }
}