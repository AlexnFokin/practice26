import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Travel Diary API',
        version: '1.0.0',
        description: 'API дневника путешествий: пользователи, путешествия, загрузка изображений.',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Локальная разработка' },
      ],
      tags: [
        { name: 'Auth', description: 'Регистрация и вход' },
        { name: 'Trips', description: 'Путешествия' },
        { name: 'Upload', description: 'Загрузка файлов' },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'next-auth.session-token',
            description: 'Сессионная кука NextAuth (ставится после /api/auth/callback/credentials)',
          },
        },
        schemas: {
          Trip: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'cmu86i142000420vjwk693s0f' },
              title: { type: 'string', example: 'Выходные в Санкт-Петербурге' },
              description: { type: 'string', nullable: true },
              latitude: { type: 'number', example: 59.9386 },
              longitude: { type: 'number', example: 30.3141 },
              address: { type: 'string', nullable: true, example: 'Санкт-Петербург, Россия' },
              image: { type: 'string', nullable: true, example: '/uploads/123-spb.jpg' },
              cost: { type: 'number', nullable: true, example: 25000 },
              heritage: { type: 'string', nullable: true, example: 'Эрмитаж, Петропавловская крепость' },
              places: { type: 'string', nullable: true, example: 'Невский проспект, Летний сад' },
              traffic: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
              safety: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
              crowdedness: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
              vegetation: { type: 'integer', minimum: 1, maximum: 5, example: 3 },
              userId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          TripInput: {
            type: 'object',
            required: ['title', 'latitude', 'longitude'],
            properties: {
              title: { type: 'string', example: 'Казань за три дня' },
              description: { type: 'string' },
              latitude: { type: 'number', example: 55.7963 },
              longitude: { type: 'number', example: 49.1088 },
              address: { type: 'string' },
              image: { type: 'string' },
              cost: { type: 'number' },
              heritage: { type: 'string' },
              places: { type: 'string' },
              traffic: { type: 'integer', minimum: 1, maximum: 5 },
              safety: { type: 'integer', minimum: 1, maximum: 5 },
              crowdedness: { type: 'integer', minimum: 1, maximum: 5 },
              vegetation: { type: 'integer', minimum: 1, maximum: 5 },
            },
          },
          UserInput: {
            type: 'object',
            required: ['email', 'name', 'password'],
            properties: {
              email: { type: 'string', format: 'email', example: 'user@example.com' },
              name: { type: 'string', example: 'Алиса' },
              password: { type: 'string', format: 'password', example: '123456' },
            },
          },
          Error: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
  });
  return spec;
};