import express from 'express'
import {pool} from '../config/dbConnection.js'
import { authenticateSession } from '../middleware/session_authenticate.js';

const router= express.Router();

router.get('/userinfo/:userid',authenticateSession, async (req,res)=>{
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


router.get('/userstreak/:userid',authenticateSession, async (req,res)=>{
    let client
    try{
        client = await pool.connect()
        const {userid}= req.params
        if(!userid){
            return res.status(400).json({message:"No userid provided"})
        }
        const dailyStreak= await client.query(`  select  ts.current_streak,ts.taskuser_id,ts.longest_streak,ts.last_completed_date::text ,t.taskname,t.taskpriority,
                                                 case
                                                    when ts.last_completed_date < (now() at time zone tu.timezone)::date - interval '1 day'
                                                        then 'inactive'
                                                    else 'active'
                                                end as streak_status
                                                
                                                from task_streak ts join taskuser tu on tu.taskuserid=ts.taskuser_id
                                                join  task t on tu.taskid=t.taskid
                                                where tu.userid=$1
                                                and tu.isactive=true
                                                order by ts.current_streak desc ,ts.longest_streak desc,ts.last_completed_date desc`,[userid])

        const dailyCompletion= await client.query(`select t.taskname ,ta.taskuser_id,
                                                    count (*) filter (where ta.event_type='completed') as completed_count,
                                                    count (*) filter (where ta.event_type='sent') as sent_count
                                                    from taskactivity ta join taskuser tu on tu.taskuserid=ta.taskuser_id 
                                                    join  task t on tu.taskid=t.taskid 
                                                        where tu.userid=$1
                                                    and tu.isactive=true
                                                    and ta.performed_at::date= (now() at time zone tu.timezone)::date
                                                    group by  t.taskname,ta.taskuser_id`,[userid,])

    

    res.status(200).json({message:"Found Streak Data",dailyStreak:dailyStreak.rows,dailyCompletion:dailyCompletion.rows})
    
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Servel Error"})
        
    }finally {
        client?.release()
    }
})


export default router
