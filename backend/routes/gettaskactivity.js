import express from 'express'
import {pool} from '../config/dbConnection.js'
import { limiter } from '../middleware/express_rate_limit.js';
import { authenticateSession } from '../middleware/session_authenticate.js';
const router= express.Router()

router.get('/taskactivity', authenticateSession , limiter , async (req,res)=>{
   let client
   const userid= req.session.user.id
    if(!userid){
            return res.status(400).json({message:"No userid provided"})
        }
    let limit = parseInt(req.query.limit) || 20;
    if(limit>50){
         limit=50
    }
    
    try{
        client= await pool.connect()


        const activity= await client.query(`select t.taskname,ta.performed_at,ta.event_type from taskactivity ta join taskuser tu
                                            on ta.taskuser_id= tu.taskuserid
                                            join task t on t.taskid= tu.taskid 
                                            where tu.userid=$1
                                            and tu.isactive=true
                                            order by ta.performed_at desc
                                            limit $2`,[userid,limit])

        if(activity.rowCount===0){
            return res.status(404).json({message:"No activities found make sure you are subscribed to atleast one activity"})
        }

        res.status(200).json({data:activity.rows,message:"Got the taskactivites"})

    }catch(error){
        return res.status(500).json({message:"Count not get the activities"})
    }finally{
        if(client){
            client.release()
        }
    }
} )

export default router