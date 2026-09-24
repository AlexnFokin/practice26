'use client';
import { useEffect, useRef } from 'react';

export default function TripMap({ lat, lng }: { lat: number; lng: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        let cancelled = false;

        const init = () => {
            if (cancelled || !ref.current) return;
            const L = (window as any).L;
            if (!L) {
                setTimeout(init, 100);
                return;
            }

            // фикс иконок маркера
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const map = L.map(ref.current).setView([lat, lng], 12);

            // 👇 Яндекс-тайлы
            L.tileLayer(
                'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&projection=web_mercator',
                {
                    attribution: '© Яндекс.Карты',
                    maxZoom: 19,
                }
            ).addTo(map);

            L.marker([lat, lng]).addTo(map);
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
    }, [lat, lng]);

    return <div ref={ref} style={{ height: 350, width: '100%', borderRadius: 8 }} />;
}