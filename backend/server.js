import express from 'express'
import cors from 'cors'
import dns from 'dns';


import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnection.js'
import testRoute from './routes/test.js'
import { Queue, Worker } from 'bullmq'
import { connection } from './config/redisConnection.js'
import { enqueueWaterMessage,enqueueExerciseMessage } from './queue/telegramMessage.js'
import './services/telegram.js'
dotenv.config()

dns.setDefaultResultOrder('ipv4first');
const port=3000
const app= express()
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
dbConnect()

// Setup Queue and Worker
export const notificationQueue = new Queue('schedular', { connection });
export const notificationWorker = new Worker('schedular', async job => {
   
    
    
    if(job.name==='DrinkWater'){
        console.log(`Water Notification Enqueued`)
        await enqueueWaterMessage()
        }

          if(job.name==='Exercise'){
        console.log(`Exercise Notification Enqueued`)
        await enqueueExerciseMessage()
        }
    


}, { connection,
    removeOnFail:{count:100},
    removeOnComplete:{count:10},
    concurrency:5,
    limiter:{
        max:10,
        duration:1000
    }
});

notificationWorker.on('completed', job => {
    console.log(`Job completed: ${job.name} (${job.id})`);
});

notificationWorker.on('failed', (job, err) => {
    console.error(`Job failed: ${job?.name} (${job?.id}) -> ${err.message}`);
});

notificationWorker.on('error', err => {
    console.error('Worker error:', err);
});

// Setup recurring job
await notificationQueue.upsertJobScheduler(
    'WaterJob',
    {
        pattern: '* * * * *', // Every minute
    },
    {
        name: 'DrinkWater',
        data: { message: 'Drink Water please'}
    }
);

await notificationQueue.upsertJobScheduler(
    'Exercise',
    {
        pattern: '*/2 * * * *', // Every minute
    },
    {
        name: 'Exercise',
        data: { message: 'Exercise Enqueing'}
    }
);



app.use('/api',testRoute)



app.listen(port, async(req,res)=>{
    console.log(`Server started on PORT: ${port}`)
})