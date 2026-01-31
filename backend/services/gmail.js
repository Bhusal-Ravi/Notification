import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

export const transporter= nodemailer.createTransport({
    pool: true,
    service:'Gmail',
     auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
})

export async function checkEmail(){
    try{
        await transporter.verify();
  console.log("SMTP Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed", err);
}
    
}