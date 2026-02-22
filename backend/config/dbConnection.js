import {Client,Pool} from 'pg'
import dotenv from 'dotenv'

    dotenv.config()

const connectionString = process.env.POSTGRES_CONNECTION_STRING

export const pool= new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 25,
    min: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    statement_timeout: 30000
})

export async function dbConnect(){
    try{
        // Pool manages connections automatically - just testing the connection
        await pool.query('SELECT NOW()')
        console.log('Database connected successfully')
    }catch(error) {
        console.log('dbError: ',error)
    }
}


