import express from 'express'
const router= express.Router()
import { client } from '../config/dbConnection.js'
import { notificationQueue } from '../server.js'




router.get('/test', async (req,res)=>{
    try{
        await notificationQueue.add('test123',{message:"Random test job"})
        res.json("New message incoming wait 5 sec")
    }catch(error){
        console.log('test route error:',error)
    }
})

export default router