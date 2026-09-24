import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL! },
    { schema: 'book' }
);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.user.upsert({
        where: { email: 'admin@test.local' },
        update: {},
        create: {
            email: 'admin@test.local',
            name: 'Admin',
            role: 'ADMIN',
            passwordHash: await bcrypt.hash('admin123', 10),
        },
    });

    await prisma.user.upsert({
        where: { email: 'user@test.local' },
        update: {},
        create: {
            email: 'user@test.local',
            name: 'User',
            passwordHash: await bcrypt.hash('user123', 10),
        },
    });

    const fantasy = await prisma.category.upsert({
        where: { slug: 'fantasy' },
        update: {},
        create: { name: 'Fantasy', slug: 'fantasy' },
    });
    const scifi = await prisma.category.upsert({
        where: { slug: 'sci-fi' },
        update: {},
        create: { name: 'Sci-Fi', slug: 'sci-fi' },
    });
    const classic = await prisma.category.upsert({
        where: { slug: 'classic' },
        update: {},
        create: { name: 'Classic', slug: 'classic' },
    });

    const tolkien = await prisma.author.upsert({
        where: { id: 1 },
        update: {},
        create: { firstName: 'J.R.R.', lastName: 'Tolkien' },
    });
    const orwell = await prisma.author.upsert({
        where: { id: 2 },
        update: {},
        create: { firstName: 'George', lastName: 'Orwell' },
    });
    const herodot = await prisma.author.upsert({
        where: { id: 3 },
        update: {},
        create: { firstName: 'Herodotus', lastName: '' },
    });

    await prisma.book.createMany({
        data: [
            { title: 'The Hobbit', year: 1937, price: 15, categoryId: fantasy.id, authorId: tolkien.id, description: 'A fantasy adventure' },
            { title: 'The Lord of Rings', year: 1954, price: 25, categoryId: fantasy.id, authorId: tolkien.id, description: 'Epic trilogy' },
            { title: '1984', year: 1949, price: 12, categoryId: scifi.id, authorId: orwell.id, description: 'Dystopia' },
            { title: 'Animal Farm', year: 1945, price: 10, categoryId: scifi.id, authorId: orwell.id, description: 'Allegory' },
            { title: 'Histories', year: -440, price: 20, categoryId: classic.id, authorId: herodot.id, description: 'Ancient history' },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Seeded');
    console.log('   admin@test.local / admin123');
    console.log('   user@test.local  / user123');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());