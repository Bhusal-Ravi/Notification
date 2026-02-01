import dotenv from 'dotenv'

dotenv.config()


export const connection = {
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    
    retryStrategy: (times) => {
        if (times > 10) {
            console.error('Redis max reconnection attempts reached')
            return null
        }
        return Math.min(times * 100, 30000)
    }
}

console.log('Redis config:', {
    host: connection.host,
    port: connection.port,
    hasPassword: !!connection.password
})