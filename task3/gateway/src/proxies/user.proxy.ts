import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import { config } from '../config';
import { authenticateAndAttachUser } from '../middlewares/auth.middleware';

export const userProxy = async (app: FastifyInstance) => {
    await app.register(proxy, {
        upstream: config.services.users,
        prefix: "/users",
        rewritePrefix: '/users',
        preHandler: [authenticateAndAttachUser]
    });
};