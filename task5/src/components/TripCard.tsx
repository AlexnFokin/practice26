import Link from 'next/link';

type TripCardProps = {
    trip: {
        id: string;
        title: string;
        address: string | null;
        cost: number | null;
        image: string | null;
        user: { name: string };
    };
};

export default function TripCard({ trip }: TripCardProps) {
    return (
        <Link href={`/trips/${trip.id}`} className="block bg-white rounded shadow hover:shadow-md transition">
            {trip.image && (
                <img src={trip.image} alt={trip.title} className="w-full h-40 object-cover rounded-t" />
            )}
            <div className="p-4">
                <h3 className="font-bold">{trip.title}</h3>
                <p className="text-sm text-gray-600">{trip.user.name}</p>
                <p className="text-sm">{trip.address}</p>
                {trip.cost != null && <p className="text-sm">💰 {trip.cost} ₽</p>}
            </div>
        </Link>
    );
}