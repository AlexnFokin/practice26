import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import TripMap from '@/components/TripMap';
import DeleteTripButton from '@/components/DeleteTripButton';

export const dynamic = 'force-dynamic';

export default async function TripPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true } } },
    });
    if (!trip) notFound();

    const session = await auth();
    const isAuthor = (session?.user as any)?.id === trip.userId;

    return (
        <article className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
            <p className="text-sm text-gray-500 mb-4">Автор: {trip.user.name}</p>

            {trip.description && <p className="mb-4">{trip.description}</p>}
            {trip.image && (
                <img
                    src={trip.image}
                    alt={trip.title}
                    className="rounded mb-4 max-h-96 object-cover"
                />
            )}

            <h2 className="font-semibold mb-2">📍 {trip.address || 'Адрес не указан'}</h2>
            <TripMap lat={trip.latitude} lng={trip.longitude} />

            <dl className="grid grid-cols-2 gap-2 mt-4">
                <dt className="text-gray-600">💰 Стоимость:</dt>
                <dd>{trip.cost ? `${trip.cost} ₽` : '—'}</dd>

                <dt className="text-gray-600">🏛 Наследие:</dt>
                <dd>{trip.heritage || '—'}</dd>

                <dt className="text-gray-600">🗺 Места:</dt>
                <dd>{trip.places || '—'}</dd>
            </dl>

            <h3 className="font-semibold mt-4">Оценки</h3>
            <ul className="list-disc list-inside">
                <li>Передвижение: {trip.traffic}/5</li>
                <li>Безопасность: {trip.safety}/5</li>
                <li>Населённость: {trip.crowdedness}/5</li>
                <li>Растительность: {trip.vegetation}/5</li>
            </ul>

            {isAuthor && <DeleteTripButton id={trip.id} />}
        </article>
    );
}