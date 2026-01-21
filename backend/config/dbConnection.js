import {Client} from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const client= new Client({
user: process.env.POSTGRES_USER,
password:process.env.POSTGRES_PASSWORD,
port:process.env.POSTGRES_PORT,
host:process.env.POSTGRES_HOST,
})

export async function dbConnect(){
    try{
        await client.connect()
        console.log('Database connected successfully')
    }catch(error) {
        console.log('dbError: ',error)
    }
}


