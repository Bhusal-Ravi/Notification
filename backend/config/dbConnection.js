import {Client,Pool} from 'pg'
import dotenv from 'dotenv'

    dotenv.config()




export const pool= new Pool({
    connectionString:  process.env.POSTGRES_CONNECTION_STRING
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


