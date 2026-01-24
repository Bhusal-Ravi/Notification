import {Client,Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const pool= new Pool({
user: process.env.POSTGRES_USER,
password:process.env.POSTGRES_PASSWORD,
port:process.env.POSTGRES_PORT,
host:process.env.POSTGRES_HOST,
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


