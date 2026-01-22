
import { client } from "../config/dbConnection.js"
import { delay, Queue,Worker } from "bullmq"
import { connection } from "../server.js"



let telegramQueue
let telegramWorker

function initializeTelegramQueue() {
    if (!telegramQueue) {
        telegramQueue = new Queue('telegram', { connection })
        telegramWorker = new Worker('telegram', async job => {
                console.log(job.id,":",job.data)

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

export async function enqueueMessage(){
    try {
        initializeTelegramQueue()
        const users= await client.query(`select u.fname,u.lname,t.taskpriority,u.email from userInfo u
                                            join taskUser tu 
                                            On u.userId=tu.userId
                                            join task t
                                            on t.taskId=tu.taskId
                                            where t.taskpriority='high' and tu.isactive='true'`)


               
                                         
                for (const user of users.rows){
                  
                    await telegramQueue.add(
                        'send-message',{user:user}
                    )
                }
    }catch(error){
        throw new Error(error)
        console.log(error)
    }
}




