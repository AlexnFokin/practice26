import { FastifyRequest, FastifyReply } from 'fastify';

export const optionalAuthenticateAndAttachUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const authHeader = request.headers.authorization;

    // токена нет — это гость, пропускаем
    if (!authHeader) {
        request.headers['x-user-id'] = '';
        request.headers['x-user-email'] = '';
        request.headers['x-user-data'] = '';
        return;
    }

    // токен есть — пробуем проверить
    try {
        await request.jwtVerify();

        const userData = request.user as {
            id: string;
            email: string;
            role?: string;
        };

        request.headers['x-user-id'] = userData.id;
        request.headers['x-user-email'] = userData.email;
        if (userData.role) request.headers['x-user-role'] = userData.role;
        request.headers['x-user-data'] = JSON.stringify(userData);
    } catch {
        // токен был, но невалиден/протух → 401
        return reply.code(401).send({ message: 'Unauthorized' });
    }
};