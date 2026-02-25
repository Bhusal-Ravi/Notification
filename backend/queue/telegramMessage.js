
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
// import { connection } from "../config/redisConnection.js"
import { bot } from "../services/telegram.js"
import { customTaskReminder, exerciseReminders, waterReminders } from "../services/messages.js"
import { connection } from "../config/redisConnection.js"
import { replace } from "react-router-dom"

import { nanoid } from 'nanoid';



const telegramQueue = new Queue('telegram', { connection })
const telegramWorker = new Worker(
    'telegram',
    async job => {
        try{

       
        const { chat_id, fname, lname, taskname,days,hours, minutes,present_time,next_notify_time,notification_type,taskpriority,taskuserid } = job.data

        if (taskname === 'Drink Water') {
             const reminderTemplates = waterReminders({ fname, lname, days, hours, minutes, present_time, next_notify_time })
            const message = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)]
            const buttonId= nanoid(10)

            await bot.sendMessage(chat_id, message,{
            parse_mode:"Markdown",
            reply_markup: {
                inline_keyboard: [
                [
                    { text: "Completed ✅ ?", callback_data: JSON.stringify({taskuserid:taskuserid,event:"completed",buttonId:buttonId}) },
                    { text: "Missed ❌ ?", callback_data:JSON.stringify( {taskuserid:taskuserid,event:"missed",buttonId:buttonId}) }
                ]
                ]
            }
        })
        }

        if (taskname === 'Daily Exercise') {
              const reminderTemplates = exerciseReminders({ fname, lname, days, hours, minutes, present_time, next_notify_time })
            const message = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)]
             const buttonId= nanoid(10)
            await bot.sendMessage(
                chat_id,message,{
            parse_mode:"Markdown",
            reply_markup: {
                inline_keyboard: [
                [
                    { text: "Completed ✅ ?", callback_data: JSON.stringify({taskuserid:taskuserid,event:"completed",buttonId:buttonId}) },
                    { text: "Missed ❌ ?", callback_data:JSON.stringify( {taskuserid:taskuserid,event:"missed",buttonId:buttonId}) }
                ]
                ]
            }
        }
            )
        }

        if(taskpriority==='usercreated'){
            console.log("Came here")
             const reminderTemplates=customTaskReminder({
                                                    fname,
                                                    lname,
                                                    taskname,
                                                    days ,
                                                    hours ,
                                                    minutes ,
                                                    present_time ,
                                                    next_notify_time,
                                                    notification_type,
                                                    }) || "Custom Message "
            const buttonId= nanoid(10)

        await bot.sendMessage(chat_id, reminderTemplates,{
            parse_mode:"Markdown",
            reply_markup: {
                inline_keyboard: [
                [
                    { text: "Completed ✅ ?", callback_data: JSON.stringify({taskuserid:taskuserid,event:"completed",buttonId:buttonId}) },
                    { text: "Missed ❌ ?", callback_data:JSON.stringify( {taskuserid:taskuserid,event:"missed",buttonId:buttonId}) }
                ]
                ]
            }
        })
        }


         }catch(error){
            console.log(error) 
            throw  error
        }
    },
    {
        connection,
        removeOnFail: { count: 100 },
        removeOnComplete: { count: 10 },
        concurrency: 5,
        limiter: {
            greatest: 10,
            duration: 1000
        }
    }
)

telegramWorker.on('completed',async  job => {
    const client= await pool.connect()
    try {
        const { userid,taskid,notification_type,taskuserid  } = job.data

        if(notification_type==='third'){
            const completeUpdate= await client.query(`update task
                                            set completed=true
                                            and taskid=$1
                                            and notification_type=$2`,[taskid,'third'])
            
            if(completeUpdate.rowCount>0){
            console.log(`Completed updated for userid:${userid} and taskid:${taskid}`)
        }
        }else {
        const lastcheckUpdate=await client.query(`update taskuser
                        set lastcheck=now()
                        where userid=$1
                        and taskid=$2`,[userid,taskid])

        if(lastcheckUpdate.rowCount>0){
            console.log(`Last check updated for userid:${userid} and taskid:${taskid}`)
        }
    }
        await client.query(`insert into taskactivity (taskuser_id,event_type)
                             values($1,$2)`,[taskuserid,'sent'])

                             
        console.log(`Telegram Job Complete: ${job.name} (${job.id})`)
    } catch (error) {
        console.error('Failed to finalize Telegram job', error)
    } finally {
        if(client) client.release()
    }
})

telegramWorker.on('failed', (job, err) => {
    console.error(`Telegram Job failed: ${job?.name} (${job?.id}) -> ${err.message}`)
})

telegramWorker.on('error', err => {
    console.error(' Telegram Worker error:', err)
})



bot.on('callback_query', async  (query)=>{
    const data= JSON.parse(query.data)
    const chatId= query.message.chat.id
    const queryId= query.id
    const {taskuserid,event,buttonId}= data
    const client= await pool.connect()
    try{
        await client.query('BEGIN')
        if(event==='completed'){
        const taskActivity= await client.query(`insert into taskactivity (performed_at,taskuser_id,event_type, telegram_button_id)
                                                    values 
                                                    (now(),$1,$2,$3)`,[taskuserid,'completed',buttonId])

        const timezoneResult= await client.query(`select timezone from taskuser where taskuserid=$1`,[taskuserid])
         
        if (timezoneResult.rowCount === 0) {
            throw new Error('Timezone not found for taskuser');
            }

        const timezone = timezoneResult.rows[0].timezone;

        const task_streak= await client.query(`insert into task_streak (taskuser_id,current_streak,longest_streak,last_completed_date)
                                                values ($1,1,1,(now() at time zone $2)::date)
                                                on conflict (taskuser_id)
                                                do update 
                                                set 
                                                current_streak=
                                                    case 
                                                        when task_streak.last_completed_date= (now() at time zone $2)::date
                                                            then task_streak.current_streak
                                                    
                                                        when task_streak.last_completed_date = (now() at time zone $2)::date - interval '1 day'
                                                            then task_streak.current_streak +1

                                                        else 1
                                                        end,
                                                        longest_streak =
                                                            CASE
                                                                WHEN task_streak.last_completed_date = (now() at time zone $2)::date
                                                                    THEN task_streak.longest_streak

                                                                WHEN task_streak.last_completed_date = (now() at time zone $2)::date - interval '1 day'
                                                                    THEN GREATEST(
                                                                            task_streak.longest_streak,
                                                                            task_streak.current_streak + 1
                                                                        )

                                                                ELSE task_streak.longest_streak
                                                            END,

                                                 last_completed_date= 
                                                    case
                                                       WHEN  task_streak.last_completed_date= (now() at time zone $2)::date
                                                        THEN task_streak.last_completed_date

                                                        else (now() at time zone $2)::date

                                                        end
                                                
                                                `,[taskuserid,timezone])       
        await client.query('update taskuser set last_user_activity=now() where taskuserid=$1',[taskuserid])                                     
        await client.query('commit')                                          
        await bot.answerCallbackQuery(query.id, {
    text: "Task marked as completed ✅",
    show_alert: true
  });

        await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [{ text: "✅Marked Complete", callback_data: JSON.stringify({ event: "noop" }) }]
            ]
        },
        {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        }
    )
        }
      

        if(event==='missed'){
            
            const taskactivity= await client.query(`select 1 from taskactivity where telegram_button_id=$1`,[buttonId])

            if(taskactivity.rowCount>0){
                 await client.query('ROLLBACK')
              return  await bot.answerCallbackQuery(query.id, {
                text: "Task already marked as complete you cannot change it ",
                show_alert: true
            });
            }
              await client.query('COMMIT')
             await bot.answerCallbackQuery(query.id, {
                text: "Task marked as missed ❌",
                show_alert: false
            });
             await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [{ text: "❌ Marked Missed", callback_data: JSON.stringify({ event: "noop" }) }]
            ]
        },
        {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        }
    )
        }

          if (event === 'noop') {
    return await bot.answerCallbackQuery(query.id, {
        text: "Already registered your option",
        show_alert: false
    })
}

      
    }catch(error){
        await client.query('rollback')

        if (error.code === '23505') {
           return await bot.answerCallbackQuery(query.id, {
    text:  "Task already completed today ✅",
    show_alert: false
  });
}

        await bot.answerCallbackQuery(query.id, {
    text: "Failed to perform your request",
    show_alert: false
  });
         console.error('Transaction failed:', error);
    }finally {
  client.release();
}


    console.log(data)

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
                                        tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname,tt.notification_type,tu.taskuserid from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 and tt.taskid=$2
                                         and now()- tu.last_user_activity>= tu.notify_after
                                         and now()-lastcheck>= tu.notify_after
                                         and ( now() at time zone 'Asia/Kathmandu')::time >= tu.online
                                         and ( now() at time zone 'Asia/Kathmandu')::time <= tu.offline
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
                                                                next_notify_time:user.next_notify_time,
                                                                taskuserid:user.taskuserid
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
        if(client) client.release()
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
										tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname,tu.taskuserid from userInfo u
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
                                         
                                         and now()-lastcheck>= interval '1 day'
                                         `,[true,2])

                
               
                console.log("exerciseList",users.rows)                
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
                                                                next_notify_time:user.next_notify_time,
                                                                taskuserid:user.taskuserid
                                                            
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

export async function customType1 (){
        const client=await  pool.connect()
     try {
        const users= await client.query(`select 
                                        TO_CHAR(((now()+ notify_after) at time zone timezone)::time,'HH12:MI:SS AM') as next_notify_time, 
                                        TO_CHAR((now() at time zone tu.timezone)::time,'HH12:MI:SS AM') as present_time,
                                        extract (day from now()-tu.last_user_activity)  as days,
                                        extract ( hour from now()-tu.last_user_activity)  as hours,
                                        extract ( minute from now()-tu.last_user_activity)  as minutes,
                                        tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname,tt.taskpriority,tt.notification_type,tt.completed  from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 
                                         and tt.taskpriority=$2
                                         and notification_type=$3
                                         and now()- tu.last_user_activity>= tu.notify_after
                                         and now()-lastcheck>= tu.notify_after
                                         and ( now() at time zone 'Asia/Kathmandu')::time >= tu.online
                                         and ( now() at time zone 'Asia/Kathmandu')::time <= tu.offline
                                         `,[true,'usercreated','first'])
                                         

                
               
                                         
                for (const user of users.rows){
                    console.log("user",user)
                    await telegramQueue.add(
                        `custom_type1 chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                userid:user.userid,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname,
                                                                taskid:user.taskid,
                                                                days:user.days,
                                                                hours:user.hours,
                                                                minutes:user.minutes,
                                                                present_time:user.present_time,
                                                                next_notify_time:user.next_notify_time,
                                                                notification_type:user.notification_type,
                                                                taskpriority:user.taskpriority,
                                                                completed: user.completed ,
                                                                taskuserid:user.taskuserid
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


export async function  customType2(){
        const client=await  pool.connect()
     try {
        const users= await client.query(`select 
                                        TO_CHAR(((now()+ notify_after) at time zone timezone)::time,'HH12:MI:SS AM') as next_notify_time, 
                                        TO_CHAR((now() at time zone tu.timezone)::time,'HH12:MI:SS AM') as present_time,
                                        extract (day from now()-tu.last_user_activity)  as days,
                                        extract ( hour from now()-tu.last_user_activity)  as hours,
                                        extract ( minute from now()-tu.last_user_activity)  as minutes,
                                        tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname,tt.taskpriority,tt.notification_type,tt.completed,tu.taskuserid from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 
										 and now()>= (
										 (
											date_trunc('day',now() at time zone tu.timezone)
											+ tu.fixed_notify_time
											)at time zone tu.timezone
										 ) 
                                            and (now() at time zone tu.timezone)::time between tu.fixed_notify_time and tu.fixed_notify_time + interval '5 minutes'
                                         and tt.taskpriority=$2
                                         and notification_type=$3
                                         and now()-lastcheck>= tu.notify_after
                                         `,[true,'usercreated','second'])
                                         

                
               console.log("Customtype2hello",users.rows)
                                         
                for (const user of users.rows){
                    console.log("user",user)
                    await telegramQueue.add(
                        `custom_type2 chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                userid:user.userid,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname,
                                                                taskid:user.taskid,
                                                                days:user.days,
                                                                hours:user.hours,
                                                                minutes:user.minutes,
                                                                present_time:user.present_time,
                                                                next_notify_time:user.next_notify_time,
                                                                notification_type:user.notification_type,
                                                                taskpriority:user.taskpriority,
                                                                completed: user.completed ,
                                                                taskuserid:user.taskuserid
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


export async function  customType3(){
        const client=await  pool.connect()
     try {
        const users= await client.query(`
select 
                                        TO_CHAR(((now()+ notify_after) at time zone timezone)::time,'HH12:MI:SS AM') as next_notify_time, 
                                        TO_CHAR((now() at time zone tu.timezone)::time,'HH12:MI:SS AM') as present_time,
                                        extract (day from now()-tu.last_user_activity)  as days,
                                        extract ( hour from now()-tu.last_user_activity)  as hours,
                                        extract ( minute from now()-tu.last_user_activity)  as minutes,
                                        tt.taskid,u.fname,u.userid,u.lname,t.chat_id,tt.taskname,tt.taskpriority,tt.notification_type,tt.completed,tu.taskuserid from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=true
										 and  (now() at time zone tu.timezone)::date = tu.fixed_notify_date
                                         
                                        and (now() at time zone tu.timezone)::time between tu.fixed_notify_time and tu.fixed_notify_time + interval '5 minutes'
                                        and tt.completed=$1 
                                        and tt.taskpriority=$2
                                         and notification_type=$3
   
                                         `,[false,'usercreated','third'])
                                         

                
               console.log("Customtype3hello",users.rows)
                                         
                for (const user of users.rows){
                    console.log("user",user)
                    await telegramQueue.add(
                        `custom_type3 chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                userid:user.userid,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname,
                                                                taskid:user.taskid,
                                                                days:user.days,
                                                                hours:user.hours,
                                                                minutes:user.minutes,
                                                                present_time:user.present_time,
                                                                next_notify_time:user.next_notify_time,
                                                                notification_type:user.notification_type,
                                                                taskpriority:user.taskpriority,
                                                                completed: user.completed ,
                                                                taskuserid:user.taskuserid
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




