import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const clean = (value = '') => {
    return value.trim().replace(/^['\"]+|[',\"]+$/g, '')
}

export const connection = {
    username: clean(process.env.REDIS_USERNAME),
    password: clean(process.env.REDIS_PASSWORD),
    socket: {
        host: clean(process.env.REDIS_HOST),
        port: Number(clean(process.env.REDIS_PORT))
    }
}

