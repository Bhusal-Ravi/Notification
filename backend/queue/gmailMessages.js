
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
// import { connection } from "../config/redisConnection.js"

import { connection } from "../config/redisConnection.js"
import { resend } from "../services/gmail.js"
import { Emailhtml } from "../services/messages.js"


const gmailQueue= new Queue('gmail',{connection})
const gmailWorker= new Worker('gmail',async job=>{
    const {dailyStreak,dailyCompletion} = job?.data
    const dailyStreakHtml= ""
    const dailyCompletionHtml= ""
    

   
   try{
const mailOptions = {
  from: 'Notification <notification@portlify.me>',
  to: [email],
  subject: `Daily Activity Report - ${readableDate}`,
  html: Emailhtml({waterCount,exerciseCount,studyCount,fname,lname,readableDate})
};

   const { data, error } = await resend.emails.send(mailOptions)
   if(error){
    
    console.log(error)

   }else {
    console.log(data)
   }


}catch(error){
  console.log(error)
  throw error
}

    
},{
        connection,
        removeOnFail: { count: 100 },
        removeOnComplete: { count: 10 },
        concurrency: 2,
        limiter: {
            max: 2,
            duration: 2000
        }
    })


   gmailWorker.on('completed',async  job => {
    const client= await pool.connect()
    try {
        console.log(`Gmail Job Complete: ${job.name} (${job.id})`)
          const {waterCount,userid,exerciseCount,studyCount,fname,lname,email,today_date} = job?.data
          await client.query(`update taskuser 
                              set lastcheck=now()
                              where taskid=5
                              and userid=$1`,[userid])
    } catch (error) {
      console.error('Failed to finalize Gmail job', error)
    } finally {
      if(client) client.release()
    }

    })
    
   gmailWorker.on('failed', (job, err) => {
        console.error(`Gmail Job failed: ${job?.name} (${job?.id}) -> ${err.message}`)
    })
    
   gmailWorker.on('error', err => {
        console.error(' Gmail Worker error:', err)
    })


  export  async function enqueueMindNightReport(){
         const client= await pool.connect()

         try{
            const users= await client.query(`select distinct on (u.userid) u.userid , tu.timezone,(now() at time zone tu.timezone)::date as today_date, u.fname,u.lname,u.email from userinfo u 
                                                join taskuser tu on tu.userid=u.userid
                                                where (now() at time zone tu.timezone)::time >= '00:00'
                                                and   (now() at time zone tu.timezone)::time < '00:05'
                                                and   taskid=5
                                                and (tu.lastcheck at time zone tu.timezone)::date < (now() at time zone tu.timezone)::date`)
                
                
                        let waterCount=0
                        let exerciseCount=0
                        let studyCount=0
             for(const user of users.rows){
                    const dailyStreak= await client.query(`  select  ts.current_streak,ts.taskuser_id,ts.longest_streak,ts.last_completed_date::text ,t.taskname,t.taskpriority
                                                from task_streak ts join taskuser tu on tu.taskuserid=ts.taskuser_id
                                                join  task t on tu.taskid=t.taskid
                                                where tu.userid=$1
                                                and tu.isactive=true
                                                order by ts.current_streak desc ,ts.longest_streak desc,ts.last_completed_date desc`,[user.userid])

        const dailyCompletion= await client.query(`select t.taskname ,ta.taskuser_id,
                                                    count (*) filter (where ta.event_type='completed') as completed_count,
                                                    count (*) filter (where ta.event_type='sent') as sent_count
                                                    from taskactivity ta join taskuser tu on tu.taskuserid=ta.taskuser_id 
                                                    join  task t on tu.taskid=t.taskid 
                                                        where tu.userid=$1
                                                    and tu.isactive=true
                                                    and ta.performed_at::date= (now() at time zone tu.timezone)::date
                                                    group by  t.taskname,ta.taskuser_id`,[user.userid,])
                        const datas= reportUser.rows
                        
                        

                       

                       gmailQueue.add('MidNight Report ',{dailyStreak:dailyStreak.rows,dailyCompletion:dailyCompletion.rows})
                }
                
         }catch(error){
           console.log(error)
         }finally{
           if(client) client.release()
         }


    }