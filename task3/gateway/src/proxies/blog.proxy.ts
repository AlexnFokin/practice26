import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import { config } from '../config';
import { optionalAuthenticateAndAttachUser } from '../middlewares/optionalAuthenticateAndAttachUser';


export const blogProxy = async (app: FastifyInstance) => {
    await app.register(proxy, {
        upstream: config.services.blog,
        prefix: "/blog",
        rewritePrefix: '/blog',
        preHandler: [optionalAuthenticateAndAttachUser]
    });
};