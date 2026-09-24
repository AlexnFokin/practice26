import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    if (!req.auth) {
        const url = new URL('/login', req.nextUrl);
        url.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
});

export const config = {
    matcher: ['/trips/new', '/my'],
};