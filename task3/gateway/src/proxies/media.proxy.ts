import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import { config } from '../config';
import { optionalAuthenticateAndAttachUser } from '../middlewares/optionalAuthenticateAndAttachUser';


export const mediaProxy = async (app: FastifyInstance) => {
    await app.register(proxy, {
        upstream: config.services.blog,
        prefix: "/media",
        rewritePrefix: '/media',
        preHandler: [optionalAuthenticateAndAttachUser]
    });
};