import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const category = u.searchParams.get('category');
  const author   = u.searchParams.get('author');
  const yearFrom = u.searchParams.get('yearFrom');
  const yearTo   = u.searchParams.get('yearTo');
  const sort     = u.searchParams.get('sort') ?? 'title:asc';

  const where: Prisma.BookWhereInput = {};
  if (category) where.categoryId = Number(category);
  if (author)   where.authorId   = Number(author);
  if (yearFrom || yearTo) {
    where.year = {
      gte: yearFrom ? Number(yearFrom) : undefined,
      lte: yearTo   ? Number(yearTo)   : undefined,
    };
  }

  const [field, dir] = sort.split(':') as [string, 'asc' | 'desc'];

  const books = await prisma.book.findMany({
    where,
    orderBy: { [field]: dir },
    include: { author: true, category: true },
  });

  return NextResponse.json(books);
}