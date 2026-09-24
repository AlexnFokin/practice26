'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationPicker from '@/components/LocationPicker';

export default function NewTripPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '',
        description: '',
        latitude: 0,
        longitude: 0,
        address: '',
        cost: '',
        heritage: '',
        places: '',
        traffic: 3,
        safety: 3,
        crowdedness: 3,
        vegetation: 3,
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        let imageUrl: string | null = null;
        if (file) {
            const fd = new FormData();
            fd.append('file', file);
            const r = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await r.json();
            imageUrl = data.url;
        }

        const res = await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, image: imageUrl }),
        });

        setLoading(false);
        if (res.ok) router.push('/my');
        else alert('Ошибка при создании');
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-3">
            <h1 className="text-xl font-bold">Новое путешествие</h1>

            <input
                placeholder="Название"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                required
                className="w-full border p-2 rounded"
            />
            <textarea
                placeholder="Описание"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full border p-2 rounded"
            />

            <p className="text-sm text-gray-600">Кликни на карту, чтобы выбрать точку:</p>
            <LocationPicker
                value={{ lat: form.latitude, lng: form.longitude }}
                onChange={(d) => {
                    set('latitude', d.lat);
                    set('longitude', d.lng);
                    set('address', d.address);
                }}
            />
            <input
                placeholder="Введите адрес врунчую"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className="w-full border p-2 rounded"
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
            />

            <input
                type="number"
                placeholder="Стоимость (₽)"
                value={form.cost}
                onChange={(e) => set('cost', e.target.value)}
                className="w-full border p-2 rounded"
            />

            <textarea
                placeholder="Культурное наследие (что посмотрели)"
                value={form.heritage}
                onChange={(e) => set('heritage', e.target.value)}
                className="w-full border p-2 rounded"
            />
            <textarea
                placeholder="Места для посещения"
                value={form.places}
                onChange={(e) => set('places', e.target.value)}
                className="w-full border p-2 rounded"
            />

            <fieldset className="border p-3 rounded">
                <legend className="px-2">Оценки (1–5)</legend>
                {(['traffic', 'safety', 'crowdedness', 'vegetation'] as const).map((k) => (
                    <label key={k} className="block">
                        {{
                            traffic: 'Передвижение',
                            safety: 'Безопасность',
                            crowdedness: 'Населённость',
                            vegetation: 'Растительность',
                        }[k]}
                        :{' '}
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={form[k]}
                            onChange={(e) => set(k, Number(e.target.value))}
                            className="border p-1 w-16 ml-2"
                        />
                    </label>
                ))}
            </fieldset>

            <button
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Сохраняем...' : 'Сохранить'}
            </button>
        </form>
    );
}