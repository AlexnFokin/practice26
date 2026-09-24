import { FastifyInstance } from 'fastify'

export const registerAuth = (app: FastifyInstance) => {

    app.decorate(
        'auth',
        async (request: any, reply: any) => {

            try {

                await request.jwtVerify()

            } catch {
                reply.code(401).send({ error: 'Unauthorized' })
            }

        }

    )

}