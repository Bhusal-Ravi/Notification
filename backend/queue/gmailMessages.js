
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
// import { connection } from "../config/redisConnection.js"

import { connection } from "../config/redisConnection.js"
import { resend } from "../services/gmail.js"
import { Emailhtml } from "../services/messages.js"


const gmailQueue= new Queue('gmail',{connection})
const gmailWorker= new Worker('gmail',async job=>{
    const {waterCount,exerciseCount,studyCount,fname,lname,email,today_date} = job?.data
    const readableDate = new Date(today_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })

   
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
        console.log(`Gmail Job Complete: ${job.name} (${job.id})`)
          const {waterCount,userid,exerciseCount,studyCount,fname,lname,email,today_date} = job?.data
          await client.query(`update taskuser 
                              set lastcheck=now()
                              where taskid=5
                              and userid=$1`,[userid])

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
                    const reportUser= await client.query(`
                                                        select t.taskname,u.fname, ta.taskid,count ( distinct ta.id) from taskactivity ta
                                                        join userinfo u on ta.userid=u.userid
                                                        join task t on t.taskid=ta.taskid
                                                        join taskuser tu on tu.userid=u.userid
                                                        where ta.userid=$1
                                                        and (performed_at at time zone tu.timezone)::date = (now() at time zone tu.timezone)::date -  1
                                                        group by  ta.taskid,t.taskname,u.fname
                                                        order by count(ta.taskid) desc`,[user.userid])
                        const datas= reportUser.rows
                        
                        

                        for(const data of datas){
                            if(data.taskname==='Drink Water'){
                                waterCount=data.count
                            }else if(data.taskname==='Study Session'){
                                studyCount=data.count
                            }else if (data.taskname==='Daily Exercise') {
                                exerciseCount=data.count
                            }
                        }

                       gmailQueue.add('MidNight Report ',{waterCount,userid:user.userid,exerciseCount,studyCount,today_date:user.today_date,fname:user.fname,lname:user.lname,email:user.email})
                }
                
         }catch(error){
           console.log(error)
         }finally{
           client.release()
         }


    }