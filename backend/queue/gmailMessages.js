
import { pool } from "../config/dbConnection.js"
import { Queue, Worker } from "bullmq"
import { connection } from "../config/redisConnection.js"


const gmailQueue= new Queue('gmail',{connection})
const gmailWorker= new Worker('gmail',async job=>{
    
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
        console.log(`Telegram Job Complete: ${job.name} (${job.id})`)
    })
    
   gmailWorker.on('failed', (job, err) => {
        console.error(`Telegram Job failed: ${job?.name} (${job?.id}) -> ${err.message}`)
    })
    
   gmailWorker.on('error', err => {
        console.error(' Telegram Worker error:', err)
    })


  export  async function enqueueMindNightReport(){
         const client= await pool.connect()

         try{

         }catch(error){
           
         }finally{
           client.release()
         }


    }