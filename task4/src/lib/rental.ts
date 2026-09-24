import { prisma } from './prisma';

export const PERIOD_DAYS = {
    TWO_WEEKS: 14,
    ONE_MONTH: 30,
    THREE_MONTHS: 90,
} as const;

export const PERIOD_COEF = {
    TWO_WEEKS: 0.15,
    ONE_MONTH: 0.25,
    THREE_MONTHS: 0.6,
} as const;

export type RentalPeriodKey = keyof typeof PERIOD_DAYS;

export async function rentBook(userId: string, bookId: number, period: RentalPeriodKey) {
    return prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({ where: { id: bookId } });
        if (!book) throw new Error('BOOK_NOT_FOUND');
        if (book.status !== 'AVAILABLE') throw new Error('NOT_AVAILABLE');

        const days = PERIOD_DAYS[period];
        const price = Number(book.price) * PERIOD_COEF[period];
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        const rental = await tx.rental.create({
            data: { bookId, userId, period, expiresAt, priceAtMoment: price },
        });
        await tx.book.update({ where: { id: bookId }, data: { status: 'RENTED' } });
        return rental;
    });
}

export async function buyBook(userId: string, bookId: number) {
    return prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({ where: { id: bookId } });
        if (!book) throw new Error('BOOK_NOT_FOUND');
        if (book.status !== 'AVAILABLE') throw new Error('NOT_AVAILABLE');

        const purchase = await tx.purchase.create({
            data: { bookId, userId, priceAtMoment: book.price },
        });
        await tx.book.update({ where: { id: bookId }, data: { status: 'SOLD' } });
        return purchase;
    });
}