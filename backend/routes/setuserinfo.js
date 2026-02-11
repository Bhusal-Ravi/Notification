import express from 'express'
import {pool} from '../config/dbConnection.js'

const router= express.Router();


router.put('/setuserinfo',async(req,res)=>{
    let client
    try{
        client= await pool.connect()
      const {email,fname,lname}= req.body
      if(!email || !fname || !lname){
        return res.status(400).json({message:"Required fields not provided"})
      }  

      const setnewuser= await client.query(`insert into userinfo(fname,lname,email)
                                            values($1,$2,$3)`,[fname,lname,email]);

        res.status(201).json({message:"User Created Successfully"})                                    

    }catch(error){
        if(error.code==='23505') {
            return res.status(409).json({message:'User already exists'})
        }
         console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})

export default router
