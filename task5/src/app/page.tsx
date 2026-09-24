import { prisma } from '@/lib/prisma';
import TripCard from '@/components/TripCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const trips = await prisma.trip.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Все путешествия</h1>
            {trips.length === 0 && <p>Пока пусто.</p>}
            <div className="grid gap-4 md:grid-cols-2">
                {trips.map((t) => (
                    <TripCard key={t.id} trip={t} />
                ))}
            </div>
        </div>
    );
}