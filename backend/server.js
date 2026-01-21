import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnection.js'
import testRoute from './routes/test.js'
dotenv.config()


const port=3000
const app= express()
dbConnect()


app.use('/api',testRoute)




app.listen(port, async(req,res)=>{
    console.log(`Server started on PORT: ${port}`)
})