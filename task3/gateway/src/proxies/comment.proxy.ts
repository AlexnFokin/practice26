import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import { config } from '../config';
import { optionalAuthenticateAndAttachUser } from '../middlewares/optionalAuthenticateAndAttachUser';


export const commentProxy = async (app: FastifyInstance) => {
    await app.register(proxy, {
        upstream: config.services.blog,
        prefix: "/comments",
        rewritePrefix: '/comments',
        preHandler: [optionalAuthenticateAndAttachUser]
    });
};