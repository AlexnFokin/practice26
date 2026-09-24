# Book Service

Веб-приложение «Библиотека книг»: каталог, аренда, покупка, личный кабинет, админка.

## Стек

- **Next.js 16** (App Router, TypeScript)
- **React 19** + **Tailwind CSS**
- **PostgreSQL 16** (в Docker)
- **Prisma 7** (с driver adapter `@prisma/adapter-pg`)
- **NextAuth v5** (JWT-сессии, Credentials Provider)
- **Zod** — валидация
- **bcryptjs** — хеширование паролей
- **node-cron** — фоновые задачи

## Функциональность

- Аутентификация: регистрация, вход, роли `USER` / `ADMIN`
- Каталог книг: фильтры (категория, автор, год), сортировка (название, год, цена)
- Карточка книги: просмотр, аренда (2 недели / 1 месяц / 3 месяца), покупка
- Личный кабинет: мои аренды, уведомления
- Админка: CRUD книг, изменение цены и статуса, управление арендами
- Фоновые задачи: напоминания об окончании аренды, автовозврат просроченных

## Требования

- Node.js 20+
- Docker (для PostgreSQL) или локальный PostgreSQL 16
- npm

## Установка

### 1. Клонирование и зависимости

```bash
git clone <repo-url> book-service
cd book-service
npm install
```

### 2. Запуск PostgreSQL

Если Docker установлен — создаём контейнер:

```bash
docker run -d --name book-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=373737 \
  -e POSTGRES_DB=learn \
  -p 5432:5432 \
  postgres:16
```

Проверить:

```bash
docker ps | grep postgres
```

Если PostgreSQL стоит локально — просто убедись, что он слушает порт 5432.

### 3. Создание схемы `book`

Подключись к БД и создай схему:

```bash
docker exec -it book-db psql -U postgres -d learn -c "CREATE SCHEMA IF NOT EXISTS book;"
```

Проверить:

```bash
docker exec -it book-db psql -U postgres -d learn -c "\dn"
```

В списке должна быть `book` и `public`.

### 4. Переменные окружения

Создай `.env` в корне проекта:

```env
# PostgreSQL (используется в DATABASE_URL)
DATABASE_URL="postgresql://postgres:373737@localhost:5432/learn?schema=book"

# NextAuth v5
NEXTAUTH_SECRET="сгенерируй-через-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="то же самое, что NEXTAUTH_SECRET"
```

Сгенерировать секрет:

```bash
openssl rand -base64 32
```

Скопируй вывод и подставь в `NEXTAUTH_SECRET` и `AUTH_SECRET`.

> ⚠️ Файл `.env` **не коммитится** в git. В репозитории — только `.env.example` с шаблоном.

### 5. Настройка Prisma (ВАЖНО)

В проекте используется **Prisma 7** с новым генератором `prisma-client` (клиент генерируется в `src/generated/prisma`, а не в `node_modules`) и **driver adapter** `@prisma/adapter-pg` (Prisma 7 не содержит встроенного коннектора к PostgreSQL).

#### 5.1. Конфиг `prisma7.config.ts`

В корне проекта должен быть файл `prisma7.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "tsx prisma/seed.ts",
    },
    datasource: {
        url: process.env["DATABASE_URL"],
    },
});
```

Ключевые моменты:

- `import "dotenv/config"` — Prisma 7 **не читает `.env` автоматически**.
- `migrations.seed` — команда для `npx prisma db seed`.
- `datasource.url` — Prisma 7 **не читает `url` из `schema.prisma`**, только отсюда.

#### 5.2. Схема `prisma/schema.prisma`

Должна содержать:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

> В Prisma 7 в `datasource` **нет поля `url`** — он передаётся через `prisma7.config.ts`.

#### 5.3. Применение миграций

```bash
npx prisma migrate dev --name init
```

Это создаст таблицы в схеме `book` и сгенерирует Prisma Client в `src/generated/prisma`.

> Если получаешь `Environment variable not found: DATABASE_URL` — проверь, что `prisma7.config.ts` импортирует `dotenv/config` и установлен `dotenv`.

#### 5.4. Seed — демо-данные

```bash
npx prisma db seed
```

Ожидаемый вывод:

```
✅ Seeded
   admin@test.local / admin123
   user@test.local  / user123
```

#### 5.5. Просмотр БД через Prisma Studio

```bash
npx prisma studio
```

Откроется `http://localhost:5555`.

#### 5.6. Важно: driver adapter

Prisma 7 **требует** driver adapter для подключения к БД. В `src/lib/prisma.ts` это выглядит так:

```ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL! },
    { schema: "book" }, // обязательно, иначе таблицы ищутся в public
);

export const prisma = new PrismaClient({ adapter });
```

Без этого будет ошибка:

```
PrismaClientInitializationError: PrismaClient was instantiated without any options.
A driver adapter is required to connect to your database.
```

То же самое в `prisma/seed.ts` — свой адаптер с `{ schema: 'book' }`.

### 6. Запуск приложения

```bash
npm run dev
```

Открой `http://localhost:3000`.

### 7. Тестовые аккаунты

| Email              | Пароль     | Роль  |
| ------------------ | ---------- | ----- |
| `admin@test.local` | `admin123` | ADMIN |
| `user@test.local`  | `user123`  | USER  |

## Структура проекта

```
book-service/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── prisma7.config.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── books/route.ts
│   │   │   ├── books/[id]/route.ts
│   │   │   ├── books/[id]/rent/route.ts
│   │   │   ├── books/[id]/buy/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── authors/route.ts
│   │   │   ├── me/rentals/route.ts
│   │   │   ├── me/notifications/route.ts
│   │   │   ├── admin/books/route.ts
│   │   │   ├── admin/books/[id]/route.ts
│   │   │   └── admin/rentals/route.ts
│   │   ├── books/[id]/page.tsx
│   │   ├── my/rentals/page.tsx
│   │   ├── my/notifications/page.tsx
│   │   ├── admin/books/page.tsx
│   │   ├── admin/books/new/page.tsx
│   │   ├── admin/books/[id]/page.tsx
│   │   ├── admin/rentals/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   └── Navbar.tsx
│   ├── generated/prisma/     ← Prisma Client (Prisma 7)
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── rental.ts
│   └── middleware.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## Полезные команды

| Команда                                | Что делает                         |
| -------------------------------------- | ---------------------------------- |
| `npm run dev`                          | Запуск в dev-режиме                |
| `npm run build`                        | Production-сборка                  |
| `npm run start`                        | Запуск production-сборки           |
| `npx prisma migrate dev --name <name>` | Создать и применить миграцию       |
| `npx prisma migrate reset --force`     | Сбросить БД и применить всё заново |
| `npx prisma db seed`                   | Залить демо-данные                 |
| `npx prisma studio`                    | Веб-интерфейс для просмотра БД     |
| `npx prisma generate`                  | Перегенерировать Prisma Client     |

## Решение проблем

### Prisma не читает `.env`

Prisma 7 не читает `.env` автоматически. Решение — `prisma7.config.ts` с `import "dotenv/config"` первой строкой.

### `PrismaClient was instantiated without any options`

Нужен driver adapter. См. `src/lib/prisma.ts` — используй `PrismaPg` из `@prisma/adapter-pg`.

### `The table public.X does not exist`

Схема не передана в адаптер. В `new PrismaPg({...}, { schema: 'book' })` укажи нужную схему.

### `self-signed certificate in certificate chain`

Корпоративный SSL. Временное решение:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma <command>
```

Правильное — указать корневой CA:

```bash
export NODE_EXTRA_CA_CERTS=/path/to/ca.pem
```

### Hydration warning в браузере

Расширения браузера (VPN, антивирус) дописывают атрибуты в `<html>` / `<body>`. Решение — `suppressHydrationWarning` на этих тегах в `layout.tsx`.

### Ошибка `Function.prototype.apply was called on #<Object>`

NextAuth v5 на Next.js 16 требует нового API. В `[...nextauth]/route.ts` используй:

```ts
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

А в `src/lib/auth.ts`:

```ts
export const { handlers, auth, signIn, signOut } = NextAuth({...});
```

## Лицензия

Учебный проект.
