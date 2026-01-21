import express from 'express'
const router= express.Router()
import { client } from '../config/dbConnection.js'




router.get('/test', async (req,res)=>{
    try{
         const user= await  client.query('Select * from UserInfo')
         if(user){
            console.log(user)
         }
    }catch(error){
        console.log('test route error:',error)
    }
})

export default router