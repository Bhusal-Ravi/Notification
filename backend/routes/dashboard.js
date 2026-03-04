import express from 'express'
import {pool} from '../config/dbConnection.js'
import { limiter } from '../middleware/express_rate_limit.js';
import { authenticateSession } from '../middleware/session_authenticate.js';

const router= express.Router();


router.get('/dashboard',authenticateSession, limiter, async (req,res)=>{
    let client
    try{
        const {id}= req.session.user
        if(!id){
         return   res.status(401).json({message:"Unauthorized Access"})
        }
        client= await pool.connect()
        // -- Total Type Group By (Only Active Tasks)
        
    const totalType= await client.query(`select t.notification_type, count (distinct tu.taskuserid)::int as taskcount from task t join 
                                                taskuser tu on tu.taskid=t.taskid
                                                where tu.userid=$1
                                                and tu.isactive= $2
                                                group by t.notification_type`,[id,true])
        

    //    -- Total notification sent to user monthly (for now 2026 - 2027) but later range can be included  isactive=true or false both      
    
    const totalSent= await client.query (`select
                                            to_char(date_trunc('month', ta.performed_at), 'FMMon YYYY') AS "month",
                                            count ( ta.taskuser_id)::int from taskactivity ta
                                            join taskuser tu on ta.taskuser_id= tu.taskuserid
                                            where tu.userid=$1
                                            AND ta.event_type=$2
                                            AND ta.performed_at >= date_trunc('year', now())
                                            AND ta.performed_at <  date_trunc('year', now()) + interval '1 year'
                                            GROUP BY date_trunc('month', ta.performed_at)
                                            ORDER BY date_trunc('month', ta.performed_at)`,[id,'sent'])



    // -- Total notification sent vs completed data (Monthly) taskwise grouped by day is active
        const taskWise= await client.query (`select 
                                            to_char(date_trunc('day', ta.performed_at), 'DD' ) AS "day",
                                            ta.taskuser_id,
                                            t.taskname,
                                            t.notification_type,
                                            count ( ta.taskuser_id) filter (where ta.event_type='sent' )::int as sent_count,
                                            count (  ta.taskuser_id) filter (where ta.event_type='completed')::int as completed_count
                                            from taskactivity ta join taskuser tu on  tu.taskuserid=ta.taskuser_id
                                            join task t on t.taskid= tu.taskid
                                            where tu.userid=$1 
                                            and  isactive=$2
                                            and date_trunc('month',ta.performed_at)=date_trunc('month',now())
                                            GROUP BY 
                                            date_trunc('day', ta.performed_at)
                                            ,ta.taskuser_id ,t.taskname, t.notification_type`,[id,true])



    return res.status(200).json({message:"Success", totalType:totalType.rows,totalSent:totalSent.rows,taskWise:taskWise.rows})

}catch(error){
    console.log(error)
    res.status(500).json("Internal server error")
    }finally{
        if(client){
            client.release()
        }
    }
})

export default router