import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL! },
    { schema: process.env.DATABASE_SCHEMA }
);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Сидим...');

    // очистка (чтобы можно было перезапускать)
    await prisma.trip.deleteMany();
    await prisma.user.deleteMany();

    // пароль для всех тестовых юзеров: "123456"
    const hash = await bcrypt.hash('123456', 10);

    // --- пользователи ---
    const alice = await prisma.user.create({
        data: {
            email: 'alice@example.com',
            name: 'Алиса',
            password: hash,
        },
    });

    const bob = await prisma.user.create({
        data: {
            email: 'bob@example.com',
            name: 'Боб',
            password: hash,
        },
    });

    // --- путешествия Алисы ---
    await prisma.trip.createMany({
        data: [
            {
                userId: alice.id,
                title: 'Выходные в Санкт-Петербурге',
                description: 'Погуляли по центру, посмотрели Эрмитаж и разводные мосты.',
                latitude: 59.9386,
                longitude: 30.3141,
                address: 'Санкт-Петербург, Россия',
                image: null,
                cost: 25000,
                heritage: 'Эрмитаж, Петропавловская крепость, Исаакиевский собор',
                places: 'Невский проспект, Летний сад, Новая Голландия',
                traffic: 4,
                safety: 5,
                crowdedness: 5,
                vegetation: 3,
            },
            {
                userId: alice.id,
                title: 'Сочи — море и горы',
                description: 'Купались, поднимались на Красную Поляну.',
                latitude: 43.6028,
                longitude: 39.7342,
                address: 'Сочи, Краснодарский край, Россия',
                cost: 60000,
                heritage: 'Дендрарий, Олимпийский парк',
                places: 'Роза Хутор, Курортный проспект, Скайпарк',
                traffic: 3,
                safety: 5,
                crowdedness: 4,
                vegetation: 5,
            },
        ],
    });

    // --- путешествия Боба ---
    await prisma.trip.createMany({
        data: [
            {
                userId: bob.id,
                title: 'Казань за три дня',
                description: 'Кремль, Баумана, татарская еда.',
                latitude: 55.7963,
                longitude: 49.1088,
                address: 'Казань, Республика Татарстан, Россия',
                cost: 18000,
                heritage: 'Казанский кремль, мечеть Кул-Шариф',
                places: 'Улица Баумана, озеро Кабан, Дворец земледельцев',
                traffic: 5,
                safety: 5,
                crowdedness: 3,
                vegetation: 3,
            },
            {
                userId: bob.id,
                title: 'Алтай — поход к Белухе',
                description: 'Дикая природа, палатки, горы.',
                latitude: 49.8075,
                longitude: 86.5900,
                address: 'Республика Алтай, Россия',
                cost: 40000,
                heritage: 'Петроглифы Калбак-Таш',
                places: 'Гора Белуха, Мультинские озёра, Чуйский тракт',
                traffic: 1,
                safety: 3,
                crowdedness: 1,
                vegetation: 5,
            },
            {
                userId: bob.id,
                title: 'Калининград и Куршская коса',
                description: 'Европейская архитектура и дюны.',
                latitude: 54.7104,
                longitude: 20.4522,
                address: 'Калининград, Россия',
                cost: 30000,
                heritage: 'Кафедральный собор, Куршская коса',
                places: 'Танцующий лес, Рыбная деревня, Балтийск',
                traffic: 4,
                safety: 5,
                crowdedness: 3,
                vegetation: 4,
            },
        ],
    });

    console.log('✅ Готово. Юзеры: alice@example.com / bob@example.com, пароль: 123456');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });