import express from 'express'
import {pool} from '../config/dbConnection.js'

const router= express.Router();

router.post('/userexist',async(req,res)=>{
      let client
    try{
        const {email}=req.body
        if(!email){
            return res.status(400).json({message:"No email provided"})
        }
        client= await pool.connect()
        const user= await client.query(`select * from userinfo where email=$1`,[email])
        if(user.rowCount===0){
           return res.status(200).json({message:'User not found',status:'fail'})
        }

        if(!user.rows[0].fname && !user.rows[0].lname){
            console.log("fname:",fname)
            return res.status(200).json({message:'Details Missing ',status:'fail'})
        }

      return  res.status(200).json({message:"User exists",data:user.rows[0],status:'pass'})

    }catch(error){
        return res.status(500).json({message:'Internal Server Error',stats:"fail"})
    }finally{
        client?.release()
    }
})

export default router