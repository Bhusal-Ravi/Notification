import express from 'express'
import {pool} from '../config/dbConnection.js'

const router= express.Router();

router.get('/userinfo/:userid', async (req,res)=>{
    let client
    try{
        client = await pool.connect()
        const {userid}= req.params
        if(!userid){
            return res.status(400).json({message:"No userid provided"})
        }
        const response= await client.query(`select t.taskname,t.taskdescription,tu.fixed_notify_time,
                            tu.timezone,tu.notify_after::text as notify_after from task t join taskuser tu
                                            on t.taskid=tu.taskid where tu.isactive=$1 
                                            and tu.userid=$2
                                            order by tu.createdat desc `,[true,userid])
        if(response.rowCount===0){
          return  res.status(200).json({message:"Not subscribed to any notifications"})
        }  
        
        return res.status(200).json({message:"Notification subscription list",data:response.rows})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Servel Error"})
        
    }finally {
        client?.release()
    }
})

export default router
