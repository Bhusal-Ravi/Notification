
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
// import { connection } from "../config/redisConnection.js"

import { connection } from "../config/redisConnection.js"
import { resend } from "../services/gmail.js"


const gmailQueue= new Queue('gmail',{connection})
const gmailWorker= new Worker('gmail',async job=>{
    const {waterCount,exerciseCount,studyCount,fname,lname,email,today_date} = job?.data

   console.log("Gmail gmail gmail")
   try{
const mailOptions = {
  from: 'NotificationBot <notification11bot@gmail.com>',
  to: [email],
  subject: `Daily Activity Report-${today_date}`,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Daily Activity Report</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .container {
      max-width: 620px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    }

    .header {
      background: linear-gradient(180deg, #ffffff, #f1f3f5);
      padding: 28px 32px;
      border-bottom: 1px solid #e5e7eb;
    }

    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      letter-spacing: 0.3px;
    }

    .content {
      padding: 32px;
      color: #1f2937;
      font-size: 15px;
      line-height: 1.6;
    }

    .content p {
      margin: 0 0 16px;
    }

    .stats {
      margin: 28px 0;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      background: #f9fafb;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 12px;
    }

    .stat-label {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
    }

    .footer {
      background: #f9fafb;
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }

    .footer strong {
      color: #111827;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h1>Daily Activity Summary</h1>
    </div>

    <div class="content">
      <p>Hello <strong>${fname} ${lname}</strong>,</p>

      <p>
        This is your midnight activity report for
        <strong>${today_date}</strong>.
      </p>

      <div class="stats">

        <!-- Water -->
        <div class="stat-row">
          <div class="stat-label">Water Intake 💧</div>
          <div class="stat-value">${waterCount}</div>
        </div>

        <!-- Exercise -->
        <div class="stat-row">
          <div class="stat-label">Exercise Sessions 🏃‍♂️</div>
          <div class="stat-value">${exerciseCount}</div>
        </div>

        <!-- Study -->
        <div class="stat-row">
          <div class="stat-label">Study Sessions 📘</div>
          <div class="stat-value">${studyCount}</div>
        </div>

      </div>

      <p>
        Consistency matters more than intensity.
        Keep showing up.
      </p>

      <p>
        Regards,<br />
        <strong>NotificationBot</strong>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} <strong>NotificationBot</strong><br />
      This is an automated daily report.
    </div>

  </div>
</body>
</html>
`


};

   const { data, error } = await resend.emails.send(mailOptions)
   console.log("Email Sent",data);

}catch(error){
  console.log(error)
}

    
},{
        connection,
        removeOnFail: { count: 100 },
        removeOnComplete: { count: 10 },
        concurrency: 5,
        limiter: {
            max: 10,
            duration: 1000
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
                                                where (now() at time zone tu.timezone)::time >= '13:00'
                                                and   (now() at time zone tu.timezone)::time < '13:30'
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