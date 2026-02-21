import express from 'express'
import cors from 'cors'
import dns from 'dns'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { connection } from './config/redisConnection.js'
import './services/gmail.js'

import dotenv from 'dotenv'
import { dbConnect } from './config/dbConnection.js'
import healthcheckRoute from './routes/healthcheck.js'
import { Queue, Worker } from 'bullmq'

import { enqueueWaterMessage,enqueueExerciseMessage, customType1, customType2, customType3 } from './queue/telegramMessage.js'
import { enqueueMindNightReport } from './queue/gmailMessages.js';
import './services/telegram.js'
import { enqueueqotd } from './queue/quoteoftheday.js'
import userinfoRoute from './routes/userinfo.js'
import updateRoute from './routes/update.js'
import checkuserexistRoute from './routes/checkuserexist.js'
import setuserinfoRoute from './routes/setuserinfo.js'
import telegramstatusRoute from './routes/telegramstatuscheck.js'
import customnotificationRoute from './routes/customnotification.js'
import telegramverifyRoute from './routes/telegramverify.js'
import { toNodeHandler } from "better-auth/node";
import { auth } from './utils/auth.js'
import { fileURLToPath } from 'url'
import { limiter } from './middleware/express_rate_limit.js'

dotenv.config()
const requiredEnvVars=[
'POSTGRES_CONNECTION_STRING',
"POSTGRES_HOST",
"REDIS_USERNAME",
"REDIS_PASSWORD",
"REDIS_HOST",
'REDIS_PORT',
'TELEGRAM_TOKEN',
'MAIL_USER',
'MAIL_PASS',
'API_KEY_QUOTES',
'RESEND_API_KEY',
'BETTER_AUTH_SECRET',
'GOOGLE_CLIENT_ID',
'GOOGLE_CLIENT_SECRET',
'BETTER_AUTH_URL',
'BETTER_AUTH_SECRET',
'DEVELOPEMENT',
]

requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Missing environment variable: ${env}`);
    process.exit(1);
  }
});
console.log('✅ All environment variables loaded');



const serverState= process.env.DEVELOPEMENT

const port=3000
const app= express()
app.set("trust proxy", 1);
const corsOptions = {
    origin: true, // reflect request origin to allow every origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
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

          if(job.name==='custom_type_1'){
            console.log(`Custom1 Notification Enqueued`)
            await customType1()

        }

          if(job.name==='custom_type_2'){
            console.log(`Custom2 Notification Enqueued`)
           await  customType2()
            

        }

          if(job.name==='custom_type_3'){
            console.log(`Custom3 Notification Enqueued`)
             await  customType3()
          

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

await notificationQueue.upsertJobScheduler(
     'Quote_Of_The_Day',
    {
        pattern: '* * * * *', // Every minute
    },
    {
        name: 'Quote_Of_The_Day',
        data: { message: 'Quote_Of_The_Day Enqueing'}
    }
)

await notificationQueue.upsertJobScheduler(
    'custom_type_1',
    {
        pattern: '* * * * *'
    },
    {
        name: 'custom_type_1',
        data:{message:'Custom Type 1 Enqueing'}
    }
)

await notificationQueue.upsertJobScheduler(
    'custom_type_2',
    {
        pattern: '* * * * *'
    },
    {
        name: 'custom_type_2',
        data:{message:'Custom Type 2 Enqueing'}
    }
)

await notificationQueue.upsertJobScheduler(
    'custom_type_3',
    {
        pattern: '* * * * *'
    },
    {
        name: 'custom_type_3',
        data:{message:'Custom Type 3 Enqueing'}
    }
)




app.use('/api',healthcheckRoute)
app.use('/api',userinfoRoute)
app.use('/api',updateRoute)
app.use('/api',checkuserexistRoute)
app.use('/api',setuserinfoRoute)
app.use('/api',telegramstatusRoute)
app.use('/api',customnotificationRoute)
app.use('/api',telegramverifyRoute)
const currentDir= path.dirname(fileURLToPath(import.meta.url))

const sslServer= https.createServer({
    key:fs.readFileSync(path.join(currentDir,'cert','key.pem')),
    cert:fs.readFileSync(path.join(currentDir,'cert','cert.pem'))
},app)

if(serverState==='local' ){
    sslServer.listen(port,async (req,res)=>{
        console.log(`Server started on PORT using ssl certificate HTTPS: ${port}`)
    })
}else {
    app.listen(port, async(req,res)=>{
    console.log(`Server started on PORT http: ${port}`)
})
}

