import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TripCard from '@/components/TripCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MyTripsPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const trips = await prisma.trip.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
    });

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Мои путешествия</h1>
                <Link
                    href="/trips/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Добавить
                </Link>
            </div>
            {trips.length === 0 && <p>У тебя пока нет путешествий.</p>}
            <div className="grid gap-4 md:grid-cols-2">
                {trips.map((t) => (
                    <TripCard key={t.id} trip={t} />
                ))}
            </div>
        </div>
    );
}