import Fastify from 'fastify'
// import cors from '@fastify/cors'

import { registerJwt } from './plugins/jwt';
import { registerAuth } from './plugins/auth';
import { healthRoutes } from './routes/health';

import { authProxy } from './proxies/auth.proxy';
import { userProxy } from './proxies/user.proxy';
import { blogProxy } from './proxies/blog.proxy';
import { mediaProxy } from './proxies/media.proxy';
import { commentProxy } from './proxies/comment.proxy';

export const buildApp = () => {

    const app = Fastify({ logger: true })

    // app.register(cors, {
    //     origin: 'http://localhost:5000',
    //     credentials: true,
    //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    //     allowedHeaders: ['Content-Type', 'Authorization'],
    // })

    registerJwt(app)

    registerAuth(app)

    app.register(healthRoutes);

    app.register(authProxy);
    app.register(userProxy);
    app.register(blogProxy);
    app.register(mediaProxy);
    app.register(commentProxy)

    return app
}