import express from 'express'
import {pool} from '../config/dbConnection.js'
import { limiter } from '../middleware/express_rate_limit.js';

const router= express.Router();


router.put('/customnotification',limiter, async(req,res)=>{
    let client
    let notify_after
    let fixed_notify_time
    let fixed_notify_date
    let online='06:00'
    let offline= '22:00'
    try{
        console.log(req.body)
        const  {email,type,title,timezone}=req.body
        if(!email || !type || !title || !timezone){
          return  res.status(400).json({message:"All the fields not provided"})
        }
        if(type !== 'first' && type !== 'second' && type !== 'third'){
            return  res.status(400).json({message:"All the fields not correct"})
        }

        client= await pool.connect()
       await  client.query('BEGIN')
        if(type==='first'){
           
            notify_after= req.body.notify_after
            const userresponse= await client.query(`select userid from userinfo where email=$1`,[email])
            if(userresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Provided Email is Invalid"})
            }
            const userid= userresponse.rows[0].userid
            const taskresponse= await client.query(`insert into task (taskname,tasktype,notification_type)
                                                values($1,$2,$3)
                                                returning taskid
                                                `,[title,'custom',type])

            if(taskresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Failed to update the notification"})
            }
            const taskid= taskresponse.rows[0].taskid

            const taskuserresponse= await client.query(`insert into taskuser (userid,taskid,isactive,lastcheck,last_user_activity,timezone,notify_after,online,offline)
                                                        values(
                                                        $1,
                                                        $2,
                                                        $3,
                                                        now(),
                                                        now(),
                                                        $4,
                                                        $5,
                                                        $6,
                                                        $7
                                                        )`,[userid,taskid,true,timezone,notify_after,online,offline])
        
                   
        if(taskuserresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Failed to update the notification"})
            }                                
               await client.query('COMMIT')                                      }

        if(type==='second'){
            fixed_notify_time= req.body.fixed_notify_time
            const userresponse= await client.query(`select userid from userinfo where email=$1`,[email])
            if(userresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Provided Email is Invalid"})
            }
            const userid= userresponse.rows[0].userid
            const taskresponse= await client.query(`insert into task (taskname,tasktype,notification_type)
                                                values($1,$2,$3)
                                                returning taskid
                                                `,[title,'custom',type])

            if(taskresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Failed to update the notification"})
            }
            const taskid= taskresponse.rows[0].taskid

            const taskuserresponse= await client.query(`insert into taskuser (userid,taskid,isactive,lastcheck,last_user_activity,
                                                                            timezone,fixed_notify_time,notify_after,online,offline)
                                                        values(
                                                        $1,
                                                        $2,
                                                        $3,
                                                        now(),
                                                        now(),
                                                        $4,
                                                        $5,
                                                        $6,
                                                        $7,
                                                        $8
                                                        )`,[userid,taskid,true,timezone,fixed_notify_time,'1 day',online,offline])
        
                   
        if(taskuserresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Failed to update the notification"})
            }                                
               await client.query('COMMIT')    
        }

        if(type==='third'){
            fixed_notify_time= req.body.fixed_notify_time
            fixed_notify_date=  req.body.fixed_notify_date
            const userresponse= await client.query(`select userid from userinfo where email=$1`,[email])
            if(userresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Provided Email is Invalid"})
            }
            const userid= userresponse.rows[0].userid
            const taskresponse= await client.query(`insert into task (taskname,tasktype,notification_type)
                                                values($1,$2,$3)
                                                returning taskid
                                                `,[title,'custom',type])

            if(taskresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Failed to update the notification"})
            }
            const taskid= taskresponse.rows[0].taskid

            const taskuserresponse= await client.query(`insert into taskuser (userid,taskid,isactive,lastcheck,last_user_activity,
                                                                            timezone,fixed_notify_time,notify_after,online,offline,fixed_notify_date)
                                                        values(
                                                        $1,
                                                        $2,
                                                        $3,
                                                        now(),
                                                        now(),
                                                        $4,
                                                        $5,
                                                        $6,
                                                        $7,
                                                        $8,
                                                        $9
                                                        )`,[userid,taskid,true,timezone,fixed_notify_time,'1 day',online,offline,fixed_notify_date])
        
                   
        if(taskuserresponse.rowCount===0){
                await client.query('ABORT') 
                return res.status(400).json({message:"Failed to update the notification"})
            }                                
               await client.query('COMMIT')   
        }
            
            return res.status(200).json({message:"Successfully added you notification"})                                   
                                                   
    }catch(error){
         await client.query('ROLLBACK') 
          console.log("Error:", error.message)
          console.log(error)
          return res.status(500).json({message:"Server error"})
         
        
    }finally{
        client.release()
    }
})

export default router