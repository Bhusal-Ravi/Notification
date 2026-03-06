import express from 'express'
import {pool} from '../config/dbConnection.js'
import { limiter } from '../middleware/express_rate_limit.js';
import { authenticateSession } from '../middleware/session_authenticate.js';

const router= express.Router();


router.get('/getsetting',authenticateSession,limiter, async(req,res)=>{
    const {id}= req.session.user
    let client
    try{
        client= await pool.connect()
        const userinfo= await client.query(`select fname,lname,email,createdat,online,offline
                                            from userinfo
                                            where userid=$1`,[id])

        if(userinfo.rowCount===0){
           return  res.status(404).json({message:"Could not find proper resources"})
        }

        res.status(200).json({message:"Found data",data:userinfo.rows[0]})

    }catch(error){
       return res.status(500).json({message:"Internal Server Error"})
    }finally{
        if(client){
            client.release()
        }
    }

})



router.put('/putsetting',authenticateSession,limiter, async(req,res)=>{
    const {id}= req.session.user
    const {fname,lname,online,offline}= req.body
    if(!fname||!lname||!online||!offline){
        return res.status(403).json({message:"All the required fields are not provided"})
    }
    let client
    try{
        client= await pool.connect()
        const userinfo= await client.query(`update userinfo 
                                            set fname=$1,lname=$2
                                            ,createdat=now(),online=$3,
                                            offline=$4 where userid=$5
                                            returning fname,lname,createdat,online,offline,email
                                            `,[fname,lname,online,offline,id])

        if(userinfo.rowCount===0){
           return  res.status(404).json({message:"Could not save the user credentials"})
        }

        res.status(200).json({message:"Updated data",data:userinfo.rows[0]})

    }catch(error){
       return res.status(500).json({message:"Internal Server Error"})
    }finally{
        if(client){
            client.release()
        }
    }

})



export default router