import express from 'express'
import cors from 'cors'
import dns from 'dns'
import { connection } from './config/redisConnection.js'


import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnection.js'
import healthcheckRoute from './routes/healthcheck.js'
import { Queue, Worker } from 'bullmq'

import { enqueueWaterMessage,enqueueExerciseMessage } from './queue/telegramMessage.js'
import { enqueueMindNightReport } from './queue/gmailMessages.js';
import './services/telegram.js'
import './queue/quoteoftheday.js'
import {checkEmail } from  './services/gmail.js'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}


checkEmail()

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
    
    console.log(job.name)
    
    
    if(job.name==='DrinkWater'){
        console.log(`Water Notification Enqueued`)
        await enqueueWaterMessage()
        }

          if(job.name==='Exercise'){
        console.log(`Exercise Notification Enqueued`)
        await enqueueExerciseMessage()
        }

        if(job.name==='MidNight_Report'){
            console.log(`MidNight_Report Notification Enqueued`)
            await enqueueMindNightReport()

        }

        if(job.name==='Quote_Of_The_Day'){
            console.log(`Quote_Of_The_Day Notification Enqueued`)
            await enqueueqotd()

        }
    


}, { connection,
    removeOnFail:{count:100},
    removeOnComplete:{count:10},
    concurrency:10,
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
        pattern: '* * * * *', // Every minute
    },
    {
        name: 'Exercise',
        data: { message: 'Exercise Enqueing'}
    }
);


await notificationQueue.upsertJobScheduler(
    'MidNight_Report',
    {
        pattern: '* * * * *', // Every minute
    },
    {
        name: 'MidNight_Report',
        data: { message: 'MidNight Report Enqueing'}
    }
);

await notificationQueue.upsertJobSchedular (
     'Quote_Of_The_Day',
    {
        pattern: '* * * * *', // Every minute
    },
    {
        name: 'Quote_Of_The_Day',
        data: { message: 'Quote_Of_The_Day Enqueing'}
    }
)


app.use('/api',healthcheckRoute)



app.listen(port, async(req,res)=>{
    console.log(`Server started on PORT: ${port}`)
})