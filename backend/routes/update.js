import express from 'express'
import {pool} from '../config/dbConnection.js'

const router= express.Router();

router.get('/updateget/:userid', async (req,res)=>{
    let client
    try{
        client = await pool.connect()
        const {userid}= req.params
        if(!userid){
            return res.status(400).json({message:"No userid provided"})
        }
        const response= await client.query(`select tu.taskid,tu.isactive,tu.timezone,tu.notify_after::text,tu.fixed_notify_time,t.taskname
                                            from taskuser tu
                                            join task t on t.taskid=tu.taskid
                                            where userid=$1`,[userid])
        if(response.rowCount===0){
          return  res.status(200).json({message:"No task found"})
        }  
        
        return res.status(200).json({message:"Current users data",data:response.rows})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Servel Error"})
        
    }finally {
        client?.release()
    }
})



router.put('/updateput/:userid', async (req,res)=>{
    let client
    try{
        client = await pool.connect()
        const {userid}= req.params
        const {fixed_notify_time,isactive,taskname,timezone,notify_after,taskid} = req.body ?? {}
        if([fixed_notify_time,isactive,taskname,timezone,notify_after,taskid].some(value => value === undefined)){
            return res.status(400).json({message:"Missing fields in body"})
        }
       if(!userid){
            return res.status(400).json({message:"No userid provided"})
        }
        const response= await client.query(`update taskuser
                                            set fixed_notify_time=$1,isactive=$2,timezone=$3,notify_after=$4
                                            where userid=$5
                                           and taskid=$6`,[fixed_notify_time,isactive,timezone,notify_after,userid,taskid])
        
        
        
        console.log('response:',response)  
        if(response.rowCount===0){
          return  res.status(400).json({message:"Could Not update your task"})
        }  
        
        return res.status(200).json({message:"Successfully Updated Your Task"})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Servel Error"})
        
    }finally {
        client?.release()
    }
})

export default router