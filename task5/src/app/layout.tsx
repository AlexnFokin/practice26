import './globals.css';
import Navbar from '@/components/Navbar';
import Script from 'next/script';
import { Providers } from './providers';

export const metadata = {
    title: 'Дневник путешествий',
    description: 'Делись своими путешествиями',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
            <head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                />
            </head>
            <body className="bg-slate-50 min-h-screen text-slate-800">
                <Providers>
                    <Navbar />
                    <main className="max-w-4xl mx-auto p-4 py-8">{children}</main>
                </Providers>
                {/* Leaflet JS грузим один раз */}
                <Script
                    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}