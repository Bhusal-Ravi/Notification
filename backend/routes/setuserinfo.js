import express from 'express'
import {pool} from '../config/dbConnection.js'
import { taskuserseed } from '../scripts/taskuserSeed.js';

const router= express.Router();


router.put('/setuserinfo',async(req,res)=>{
    let client
    try{
        client= await pool.connect()
        await client.query('BEGIN')
      const {email,fname,lname}= req.body
      if(!email || !fname || !lname){
        await client.query('ABORT')
        return res.status(400).json({message:"Required fields not provided"})
      }  


      const setnewuser= await client.query(`insert into userinfo(fname,lname,email)
                                            values($1,$2,$3)
                                            on conflict (email) 
                                            do update 
                                            set fname=$1,lname=$2,email=$3
                                            returning userid`,[fname,lname,email]);


        if(setnewuser.rowCount===0){
            await client.query('ROLLBACK')
             return res.status(400).json({message:"Failed to perform action"})
            
        }

        const seedData= taskuserseed()
        const taskseed= await client.query(`insert into taskuser (userid,taskid,isactive,createdat,lastcheck,last_user_activity)
                                                                values
                                                                ${seedData.payload}
                                                                `,[setnewuser.rows[0].userid])
        if(taskseed.rowCount!==seedData.tasknumber){
             await client.query('ROLLBACK')
            return res.status(400).json({message:"Failed to perform action number"})
        }

       
        



        await client.query('COMMIT')
       return res.status(201).json({message:"User Created Successfully"})                                    



    }catch(error){
        await client.query('ROLLBACK')
        if(error.code==='23505') {
            return res.status(409).json({message:'User already exists'})
        }
         console.error(error);
        res.status(500).json({ message: "Server error" });
    }finally{
        client.release()
    }
})

export default router
