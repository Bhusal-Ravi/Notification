import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from 'dotenv'

    dotenv.config()
const connectionString = process.env.POSTGRES_CONNECTION_STRING
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
   advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
   
  },
  experimental: { joins: true },
    
  database: new Pool({
     connectionString,
    ssl: { rejectUnauthorized: false }
  }),
  socialProviders:{
     google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
        }, 
  },
  trustedOrigins:[
     "https://notification-production-01a0.up.railway.app",
    "https://notification-beige-two.vercel.app",
     "https://localhost:5173",
    "https://localhost:3000",
  ]
});