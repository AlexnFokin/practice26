import { FastifyInstance } from 'fastify'
import proxy from '@fastify/http-proxy';
import { config } from '../config';


export const authProxy = (app: FastifyInstance) => {

    app.register(proxy, {

        upstream: config.services.auth,
        prefix: "/auth",
        rewritePrefix: '/'

    })

}
