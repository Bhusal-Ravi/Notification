
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
// import { connection } from "../config/redisConnection.js"
import { bot } from "../services/telegram.js"
import { exerciseReminders, waterReminders } from "../services/messages.js"
import { connection } from "../config/redisConnection.js"

const telegramQueue = new Queue('telegram', { connection })
const telegramWorker = new Worker(
    'telegram',
    async job => {
        const { chat_id, fname, lname, taskname,days,hours, minutes,present_time,next_notify_time } = job.data

        if (taskname === 'Drink Water') {
             const reminderTemplates = waterReminders({ fname, lname, days, hours, minutes, present_time, next_notify_time })
            const message = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)]

            await bot.sendMessage(chat_id, message)
        }

        if (taskname === 'Daily Exercise') {
              const reminderTemplates = exerciseReminders({ fname, lname, days, hours, minutes, present_time, next_notify_time })
            const message = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)]
            await bot.sendMessage(
                chat_id,message
            )
        }
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

telegramWorker.on('completed',async  job => {
    const client= await pool.connect()
    const { userid,taskid } = job.data

    const lastcheckUpdate=await client.query(`update taskuser
                        set lastcheck=now()
                        where userid=$1
                        and taskid=$2`,[userid,taskid])

    client.release()
    if(lastcheckUpdate.rowCount>0){
        console.log(`Last check updated for userid:${userid} and taskid:${taskid}`)
    }

    console.log(`Telegram Job Complete: ${job.name} (${job.id})`)
})

telegramWorker.on('failed', (job, err) => {
    console.error(`Telegram Job failed: ${job?.name} (${job?.id}) -> ${err.message}`)
})

telegramWorker.on('error', err => {
    console.error(' Telegram Worker error:', err)
})

export async function enqueueWaterMessage(){
    const client= await pool.connect()
    try {
        const users= await client.query(`select 
                                        TO_CHAR(((now()+ notify_after) at time zone timezone)::time,'HH12:MI:SS AM') as next_notify_time, 
                                        TO_CHAR((now() at time zone tu.timezone)::time,'HH12:MI:SS AM') as present_time,
                                        extract (day from now()-tu.last_user_activity)  as days,
                                        extract ( hour from now()-tu.last_user_activity)  as hours,
                                        extract ( minute from now()-tu.last_user_activity)  as minutes,
                                        tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 and tt.taskid=$2
                                         and now()- tu.last_user_activity>= tu.notify_after
                                         and now()-lastcheck>= tu.notify_after
                                         `,[true,1])

                
               
                                         
                for (const user of users.rows){

                    await telegramQueue.add(
                        `water notify chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                userid:user.userid,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname,
                                                                taskid:user.taskid,
                                                                days:user.days,
                                                                hours:user.hours,
                                                                minutes:user.minutes,
                                                                present_time:user.present_time,
                                                                next_notify_time:user.next_notify_time
                                                            },{
                                                                    attempts:3,
                                                                    backoff:{
                                                                        type:'fixed',
                                                                        delay:3000
                                                                    },
                                                                }
                    )
                }
    }catch(error){
        
        console.log(error)
    } finally {
        client.release()
    }
}


export async function enqueueExerciseMessage(){
    const client=await  pool.connect()
     try {
        const users= await client.query(`select	fixed_notify_time as next_notify_time, 
                                        TO_CHAR((now() at time zone tu.timezone)::time,'HH12:MI:SS AM') as present_time,
                                        extract (day from now()-tu.last_user_activity)  as days,
                                        extract ( hour from now()-tu.last_user_activity)  as hours,
                                        extract ( minute from now()-tu.last_user_activity)  as minutes,
										tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 and tt.taskid=$2
										 and now()>= (
										 (
											date_trunc('day',now() at time zone tu.timezone)
											+ tu.fixed_notify_time
											)at time zone tu.timezone
										 ) 
                                            and (now() at time zone tu.timezone)::time between tu.fixed_notify_time and tu.fixed_notify_time + interval '5 minutes'
                                         
                                         and now()-lastcheck>= tu.notify_after
                                         `,[true,2])

                
               
                                         
                for (const user of users.rows){

                    await telegramQueue.add(
                        `exercise notify chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                userid:user.userid,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname,
                                                                taskid:user.taskid,
                                                                days:user.days,
                                                                hours:user.hours,
                                                                minutes:user.minutes,
                                                                present_time:user.present_time,
                                                                next_notify_time:user.next_notify_time},{
                                                                    attempts:3,
                                                                    backoff:{
                                                                        type:'fixed',
                                                                        delay:3000
                                                                    },
                                                                }
                    )
                }
    }catch(error){
        
        console.log(error)
    } finally {
        client.release()
    }

}




