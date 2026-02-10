import React from 'react'
import {authClient} from '../../lib/auth-client'






function Login() {

  async function LoginUser(){
   
   try{ 
    await authClient.signIn.social({
      provider:'google',
      callbackURL:'/main',
      
      newUserCallbackURL:'/welcome',
       disableRedirect: false,
    })
    }catch(error){
      console.log(error)
    }
  }

  return (
    <button onClick={LoginUser} className='bg-black rounded-md'>
      <span className='bg-[#ffff00] block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
        Login With Google
      </span>
    </button>
  )
}

export default Login