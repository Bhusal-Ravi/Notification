import React from 'react'
import {authClient} from '../../lib/auth-client'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')






function Login() {

  async function LoginUser(){
   
   try{ 
    await authClient.signIn.social({
      provider:'google',
      callbackURL:'http://localhost:5173/main',
      
      newUserCallbackURL:'http://localhost:5173/welcome',
       disableRedirect: false,
    })
    }catch(error){
      console.log(error)
    }
  }

   const { data: session, isPending } = authClient.useSession()

   async function getUser(){
    try{
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response= await fetch(`${base}/api/userexist`)
    }catch(error){

    }
   }

  if(!session) return (
    <button onClick={LoginUser} className='bg-black rounded-md'>
      <span className='bg-[#ffff00] block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
        Login With Google
      </span>
    </button>
  )
  return (
    <div className='bg-black rounded-md'>
       
      <span className='bg-[#ffff00] block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
        
      </span>
    
    </div>
  )
}

export default Login