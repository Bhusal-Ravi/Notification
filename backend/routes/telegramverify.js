import express from 'express'
import { pool } from '../config/dbConnection.js'
import { authenticateSession } from '../middleware/session_authenticate.js'
import crypto from 'crypto'

const router= express.Router()


function generateOtp(){
    return crypto.randomInt(100000,999999).toString()
}

function generateHash(data){
    return crypto.createHash('sha256')
                 .update(data)
                 .digest('hex')
}


router.post('/telegramverify', authenticateSession, async (req,res)=>{
    let client
    try{
        const session= req.session;
        const {id,email}= session.user
        client= await pool.connect();
        const otp= generateOtp();
        const otphash= generateHash(otp)
        await client.query('BEGIN')
        const clientotp= "/link ".concat(otp).concat(" ").concat(email)

        const otpexpire= await client.query(`update telegramotp
                                                set used=true
                                                where userid=$1
                                                and used=false
                                                and expiresat <= now()`,[id])

        const optinsert= await client.query(`insert into telegramotp
                                             (tokenhash,userid,email)
                                             values 
                                             ($1,$2,$3)`,[otphash,id,email])

        
        await client.query('COMMIT')
      return  res.status(200).json({message:"Telegram otp",data:clientotp})

        



    }catch(error){
        console.log(error)
        if (client) {
    await client.query('ROLLBACK');
}
        if(error.code==='23505'){
            
           return res.status(409).json({message:"You have already generated an OTP, wait 5 minutes before trying again"})
        }

       return res.status(500).json({message:"Internal server error"})
    }finally{
        if (client) client.release();
    }
})

export default router