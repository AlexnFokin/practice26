import { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt';


export const registerJwt = (app: FastifyInstance) => {

    app.register(fastifyJwt, {
        secret: process.env.JWT_ACCESS_SECRET || 'jwt-access-secrete'
    })
}