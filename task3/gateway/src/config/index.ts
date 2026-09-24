import './env'

import { z } from 'zod'


const envSchema = z.object({

    NODE_PORT: z.string().default('7000'),

    AUTH_SERVICE_URL: z.string().url(),
    USER_SERVICE_URL: z.string().url(),
    BLOG_SERVICE_URL: z.string().url()

})


const parsed = envSchema.safeParse(process.env)


if (!parsed.success) {

    console.error('❌ Invalid environment variables')

    console.error(parsed.error.format())

    process.exit(1)
}

const env = parsed.data


export const config = {

    port: Number(env.NODE_PORT),

    services: {
        auth: env.AUTH_SERVICE_URL,
        users: env.USER_SERVICE_URL,
        blog: env.BLOG_SERVICE_URL,
    }
}