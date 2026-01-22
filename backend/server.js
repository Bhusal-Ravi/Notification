import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnection.js'
import testRoute from './routes/test.js'
import { Queue, Worker } from 'bullmq'
dotenv.config()


const port=3000
const app= express()
dbConnect()

// Setup Queue and Worker
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
};

let count = 0;



export const notificationQueue = new Queue('hello', { connection });
export const notificationWorker = new Worker('hello', async job => {
    count++;
    console.log(`Count: ${count}`, job.data, job.name);
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
    'repeatingJob',
    {
        pattern: '* * * * *', // Every minute
    },
    {
        name: 'repeat',
        data: { message: 'Recurring notification check' }
    }
);



app.use('/api',testRoute)



app.listen(port, async(req,res)=>{
    console.log(`Server started on PORT: ${port}`)
})