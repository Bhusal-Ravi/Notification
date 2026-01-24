
import { pool } from "../config/dbConnection.js"
import { delay, Queue,Worker } from "bullmq"
import { connection } from "../server.js"
import { bot } from "../services/telegram.js"



let telegramQueue
let telegramWorker

function initializeTelegramQueue() {
    if (!telegramQueue) {
        telegramQueue = new Queue('telegram', { connection })
        telegramWorker = new Worker('telegram', async job => {
                const {chat_id,fname,lname,taskname}= job.data
     
     if(taskname==='Drink Water'){
     
                bot.sendMessage(
  chat_id,
  `💧 Water Intake Reminder ⏰

Hello ${fname} ${lname} 👋,

This is a gentle reminder to stay hydrated and complete your scheduled water intake 💙.

Please take a moment to drink water now 🚰🥤  
Your health and well-being matter 🌱✨

Stay healthy and take care 😊`
);
}

if(taskname==='Daily Exercise'){

    bot.sendMessage(
  chat_id,
 `🏃‍♂️ Daily Exercise Reminder ⏰

Hello ${fname} ${lname} 👋,

This is a friendly reminder to complete your daily exercise and stay physically active 💪.

Regular movement helps improve your energy, focus, and overall well-being 🧠✨  
Please take some time today to exercise and care for your health 🏋️‍♀️🤸‍♂️

Stay active and stay healthy 🌱😊`

);

}



        }, { connection,
            removeOnFail: { count: 100 },
            removeOnComplete: { count: 10 },
            concurrency: 5,
            limiter: {
                max: 10,
                duration: 1000
            }
        });
    }
}

export async function enqueueWaterMessage(){
    const client= await pool.connect()
    try {
        initializeTelegramQueue()
        const users= await client.query(`select u.fname,u.lname,t.chat_id,taskname from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 and tt.taskid=$2`,[true,1])

                
               
                                         
                for (const user of users.rows){

                    await telegramQueue.add(
                        `water notify chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname}
                    )
                }
    }catch(error){
        
        console.log(error)
    }
}


export async function enqueueExerciseMessage(){
    const client=await  pool.connect()
     try {
        initializeTelegramQueue()
        const users= await client.query(`select u.fname,u.lname,t.chat_id,taskname from userInfo u
                                         join telegramusers t
                                         on t.userid=u.userid
                                         join taskuser tu
                                         on  tu.userid=u.userid
										 join task tt
										 on tt.taskid=tu.taskid
										 where tu.isactive=$1 and tt.taskid=$2`,[true,2])

                
               
                                         
                for (const user of users.rows){

                    await telegramQueue.add(
                        `exercise notify chatid: ${user.chat_id}`,{chat_id:user.chat_id,
                                                                taskname:user.taskname,
                                                                fname:user.fname,
                                                                lname:user.lname}
                    )
                }
    }catch(error){
        
        console.log(error)
    }

}




