'use client';
import { useEffect, useRef } from 'react';

type Props = {
    value: { lat: number; lng: number };
    onChange: (d: { lat: number; lng: number; address: string }) => void;
};

export default function LocationPicker({ value, onChange }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        let cancelled = false;

        const init = () => {
            if (cancelled || !ref.current) return;
            const L = (window as any).L;
            if (!L) {
                setTimeout(init, 100);
                return;
            }

            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const hasPos = value.lat !== 0 && value.lng !== 0;
            const center: [number, number] = hasPos ? [value.lat, value.lng] : [55.75, 37.61];

            const map = L.map(ref.current).setView(center, 10);

            // 👇 Яндекс-тайлы
            L.tileLayer(
                'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&projection=web_mercator',
                {
                    attribution: '© Яндекс.Карты',
                    maxZoom: 19,
                }
            ).addTo(map);

            if (hasPos) {
                markerRef.current = L.marker(center).addTo(map);
            }

            map.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
                else markerRef.current = L.marker([lat, lng]).addTo(map);

                // geocoder отключён — адрес вводится вручную
                onChange({ lat, lng, address: '' });
            });

            mapRef.current = map;
        };

        init();
        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // eslint-disable-line

    return <div ref={ref} style={{ height: 350, width: '100%', borderRadius: 8 }} />;
}