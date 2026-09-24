import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticateAndAttachUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // Проверяем JWT
        await request.jwtVerify();

        // Получаем данные пользователя из токена
        const userData = request.user as {
            id: string;
            email: string;
            role?: string;
        };

        // Добавляем в заголовки
        request.headers['x-user-id'] = userData.id;
        request.headers['x-user-email'] = userData.email;

        if (userData.role) {
            request.headers['x-user-role'] = userData.role;
        }

        // Добавляем весь объект пользователя
        request.headers['x-user-data'] = JSON.stringify(userData);

    } catch (err) {
        reply.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
};