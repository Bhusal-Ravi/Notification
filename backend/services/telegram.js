import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import { pool } from '../config/dbConnection.js'
dotenv.config()

const token= process.env.TELEGRAM_TOKEN

export const bot = new TelegramBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  },
  request: {
    timeout: 60000 // 60 seconds
  }
})

bot.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'help', description: 'List all commands' },
  { command: 'status', description: 'Check your status' },
  { command: 'water', description: 'Enable Drink Water reminders at regular intervals of 1 hour' },
  { command: 'exercise', description: 'Enable Daily Exercise reminders sent every day at 3:45 PM.' },
  { command: 'study', description: 'Enable Study reminders sent every day.' },
  { command: 'input', description: 'Input performed task e.g. /input water, /input exercise' },
]);

bot.onText(/\/start/,async  (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

   const helpMessage = `
👋 Welcome!
Notification is a alert bot that helps you stay alert or notified about your important tasks

Please type /help to get the list of instructions



`;

  await bot.sendMessage(chatId, helpMessage);
});

bot.onText(/\/help/,async  (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

   const helpMessage = `
📖 Available Commands

Use the commands below to register for notifications and manage your tasks:

Caution: /activateNotify <registered-email> in order to activate other command

/activateNotify <your-registered-email> — Register yourself with our service to start receiving notifications.

/taskList — View the list of available tasks you can register for.

/water — Enable Drink Water reminders at regular intervals.

/exercise — Enable Daily Exercise reminders sent every day at 3:45 PM.

/study — Enable Study reminders sent every day.

Type any command to get started. ✅

`;

  await bot.sendMessage(chatId, helpMessage);
})


bot.onText(/\/activateNotify\s+(.+)/,async  (msg,match) => {
  console.log("helllo")
  const chatId = msg.chat.id;
  const telegramUserId = msg.from.id;
  const email = match[1].trim().toLowerCase();
  console.log(email)
    if(!email){
       return  await bot.sendMessage(chatId, ` Please type your email foreg:
/activateNotify test@gmail.com`);
    }

    const client = await pool.connect();

    try{
      await client.query('BEGIN');

      const userRes= await client.query(`select userid from userinfo where email=$1`,[email])

      if(!userRes.rows.length){
        throw new Error (`EMAIL_NOT_REGISTERED`)
      }

      const userId=userRes.rows[0].userid;
      console.log(userId)

      const telegramRes= await client.query(`select 1 from telegramusers where telegram_user_id=$1`,[telegramUserId])
      ''
      if(telegramRes.rowCount>0){
        throw new Error (`TELEGRAM_ALREADY_LINKED`)
      }

      await client.query(`insert into telegramUsers(userid,telegram_user_id,chat_id)
                          values 
                          ($1,$2,$3)`,[userId,telegramUserId,chatId])

      await client.query('COMMIT')

      await bot.sendMessage(chatId, `✅ You are officially registered to the notification system under [${email}]`)
    }catch (err) {
  await client.query('ROLLBACK');
      console.log(err)
  if (err.message === 'EMAIL_NOT_REGISTERED') {
   await  bot.sendMessage(chatId, '❌ Email not registered with us');
  } else if (err.message === 'TELEGRAM_ALREADY_LINKED') {
   await  bot.sendMessage(chatId, '⚠️ This Telegram account is already linked');
  } else {
   await  bot.sendMessage(chatId, '❌ Something went wrong');
  }
}finally {
  client.release();
}

  
})

bot.onText(/\/(water|exercise|study)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramUserId=msg.from.id
  
  const command = match[1].toLowerCase(); 

  const client = await pool.connect();
  try{
  await client.query('BEGIN')
    if(command==='water'){

      const telegramRes= await client.query(`Select 1 from telegramusers where telegram_user_id=$1`,[telegramUserId])
      if(telegramRes.rowCount===0){
        throw new Error (`You have not activated you notification service, 
          /activateNotify <your-registered-email>
          for registering in notification service`)
      }

      const activate= await client.query(`update taskuser tu
                                          set isactive=true
                                          from telegramusers t
                                          where t.userid=tu.userid and
                                          t.telegram_user_id=$1 and tu.taskid=$2 and tu.isactive=false
                                          RETURNING tu.*
                                          `,[telegramUserId,1])

        console.log('activate: ',activate.rows)
        if(activate.rowCount===0){
         await  bot.sendMessage(chatId,`You have already activated water notification`)
        } else if(activate.rowCount===1 ){
         await  bot.sendMessage(chatId,`Successfully activated water notification`)
        }
        await client.query('COMMIT');
    }

    if (command==='exercise'){
       const telegramRes= await client.query(`Select 1 from telegramusers where telegram_user_id=$1`,[telegramUserId])
      if(telegramRes.rowCount===0){
        throw new Error (`You have not activated you notification service, 
          /activateNotify <your-registered-email>
          for registering in notification service`)
      }

      const activate= await client.query(`update taskuser tu
                                          set isactive=true
                                          from telegramusers t
                                          where t.userid=tu.userid and
                                          t.telegram_user_id=$1 and tu.taskid=$2 and tu.isactive=false
                                          RETURNING tu.*
                                          `,[telegramUserId,2])

        console.log('activate: ',activate.rows)
        if(activate.rowCount===0){
         await bot.sendMessage(chatId,`You have already activated exercise notification`)
        } else if(activate.rowCount===1 ){
         await  bot.sendMessage(chatId,`Successfully activated exercise notification`)
        }
        await client.query('COMMIT');
    }

       if (command==='study'){
       const telegramRes= await client.query(`Select 1 from telegramusers where telegram_user_id=$1`,[telegramUserId])
      if(telegramRes.rowCount===0){
        throw new Error (`You have not activated you notification service, 
          /activateNotify <your-registered-email>
          for registering in notification service`)
      }

      const activate= await client.query(`update taskuser tu
                                          set isactive=true
                                          from telegramusers t
                                          where t.userid=tu.userid and
                                          t.telegram_user_id=$1 and tu.taskid=$2 and tu.isactive=false
                                          RETURNING tu.*
                                          `,[telegramUserId,3])

        console.log('activate: ',activate.rows)
        if(activate.rowCount===0){
        await  bot.sendMessage(chatId,`You have already activated Study notification`)
        } else if(activate.rowCount===1 ){
         await  bot.sendMessage(chatId,`Successfully activated Study notification`)
        }
        await client.query('COMMIT');
        client.release()
    }
  }
    catch(error){
      await client.query('ROLLBACK');
      client.release()
      console.log(error)
    await  bot.sendMessage(chatId,'Something went wrong')
  }

  
});


bot.onText(/\/input\s+(.+)/, async  (msg,match) => {

const chatId= msg.chat.id
const telegramUserId=msg.from.id
const command= msg.text.split(' ')[0]?.toLowerCase()
const message=msg.text.split(' ')[1]?.toLowerCase()

const client= await pool.connect()
 
  if(!['water', 'exercise', 'study'].includes(message)){ 
    return await bot.sendMessage(chatId,`If you want to register your performed task
these are the available commands 
[ 1) /input water ]
[ 2) /input exercise ]
[ 3) /input study ]`)
  }

  await client.query('BEGIN')


        try{
          const userCheck= await client.query(`select 1 from userinfo u
                                                join taskuser tu 
                                                on u.userid=tu.userid
                                                join telegramusers t 
                                                on t.userid=u.userid
                                                where tu.taskid=$1 and 
                                                tu.isactive=$2 and 
                                                t.telegram_user_id=$3`,[message==='water'?1:message==='exercise'?2:3,true,telegramUserId])
          
          if(userCheck.rowCount===0){
         return  await  bot.sendMessage(chatId,`❌ You might not be registered with us
or You may not have activated the particular service `)
          }

          
          const updateUserActivity= await client.query(`update taskuser
                                                        set last_user_activity=now()
                                                        where userid=(select userid 
                                                        from telegramusers where telegram_user_id=$1)
                                                        and taskid=$2 and isactive=$3`,[telegramUserId,message==='water'?1:message==='exercise'?2:3,true])
            

          if(updateUserActivity.rowCount===0){
           throw new Error(`updateUserActivity_error`)
          }
          

          const activityCountUpdate= await client.query(`insert into taskactivity(userid,taskid)
                                                        values(
                                                        (select userid 
                                                        from telegramusers 
                                                        where telegram_user_id=$1),
                                                        $2
                                                        )`,[telegramUserId,message==='water'?1:message==='exercise'?2:3])
            if(activityCountUpdate.rowCount===0){
           throw new Error(`activityCountUpdate_error`)
          }else {
            await bot.sendMessage(chatId,`✅ Successfully updated your ${message} activity input`)
          }

                
          await client.query('COMMIT')
          client.release()
          
          }catch(error){
            await client.query('ROLLBACK')
            client.release()
           
              await bot.sendMessage(chatId,'❌ Could not perform your task at the moment')
        }
})

