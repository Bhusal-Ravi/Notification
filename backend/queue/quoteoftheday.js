
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
// import { connection } from "../config/redisConnection.js"
import { bot } from "../services/telegram.js"
import {  qotdMessages } from "../services/messages.js"
import { connection } from "../config/redisConnection.js"
import dotenv from 'dotenv'
dotenv.config()


const quoteofthedayQueue = new Queue('qotd', { connection })
const quoteofthedayworker = new Worker(
    'qotd',
    async job => {
    const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});
const qotdClosing= qotdMessages[Math.floor(Math.random() * qotdMessages.length)]
        const  {fname,lname,userid,telegram_user_id,chat_id,timezone,quotes}= job.data
        const quote= quotes.quote.body
        const author= quotes.quote.author
        const tags= quotes.quote.tags?.join(" , ")

const message = `
🌅 *Quote of the Day*
📅 ${today} • 6:00 AM

“${quote}”
— *${author}*

${tags}

${fname} ${lname},
${qotdClosing}
`;

        bot.sendMessage(chat_id,message,{
            parse_mode:"Markdown"
        })
        
    },
    {
        connection,
        removeOnFail: { count: 100 },
        removeOnComplete: { count: 10 },
        concurrency: 5,
        limiter: {
            max: 10,
            duration: 1000
        }
    }
)


quoteofthedayworker.on('completed',async  job => {
    const client= await pool.connect()
    const { userid } = job.data

    const lastcheckUpdate=await client.query(`update taskuser
                        set lastcheck=now()
                        where userid=$1
                        and taskid=$2`,[userid,6])

    client.release()
    if(lastcheckUpdate.rowCount>0){
        console.log(`Last check updated for userid:${userid} taskid:6`)
    }

    console.log(`Telegram Job Complete: ${job.name} (${job.id})`)
})

quoteofthedayworker.on('failed', (job, err) => {
    console.error(`Telegram Job failed: ${job?.name} (${job?.id}) -> ${err.message}`)
})

quoteofthedayworker.on('error', err => {
    console.error(' Telegram Worker error:', err)
})


export async function enqueueqotd(){
    let client= await pool.connect();
    try{
        let quotes=""
        
        const qotdUsers= await client.query(` select u.fname,u.lname,u.userid,t.telegram_user_id,t.chat_id,tu.timezone from userinfo u
                                                join taskuser tu on tu.userid=u.userid
                                                join telegramusers t on t.userid=u.userid
                                                where tu.taskid=6 and tu.isactive=true
                                                and (now() at time zone tu.timezone)::time >= '17:12'
                                                and (now() at time zone tu.timezone)::time < '17:30'
                                                and  now()-lastcheck>= tu.notify_after  
                                            `)
        if(qotdUsers.rowCount>0){
            try{
                const options={
            method:'GET',
            headers:{
                'Authorization':`Token token="${process.env.API_KEY_QUOTES}"`
        }
    };
            const url = 'https://favqs.com/api/qotd';

                const response= await fetch(url,options);
                quotes= await response.json();
        

            }catch(error){
                console.log(error)
                return
                
            }
        }


        for(const user of qotdUsers.rows) {
            const {fname,lname,userid,telegram_user_id,timezone,chat_id}=user
            quoteofthedayQueue.add(`qotd job: userid: ${telegram_user_id}`,{
                                                                            fname,
                                                                            lname,
                                                                            userid,
                                                                            telegram_user_id,
                                                                            chat_id,
                                                                            timezone,
                                                                            quotes
                                                                        },{
                                                                    attempts:3,
                                                                    backoff:{
                                                                        type:'fixed',
                                                                        delay:3000
                                                                    },
                                                                })
        }

    }catch(error){
        console.log(error)
    }finally{
        await client.release()
    }
}

