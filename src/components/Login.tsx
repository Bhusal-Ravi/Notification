import React from 'react'
import {authClient} from '../../lib/auth-client'






function Login() {

  async function LoginUser(){
    console.log("....")
   try{ 
    const frontendOrigin = (import.meta.env.VITE_APP_URL ?? window.location.origin).replace(/\/$/, '')
    await authClient.signIn.social({
      provider:'google',
      callbackURL:`${frontendOrigin}/main`,
      
      newUserCallbackURL:`${frontendOrigin}/welcome`,
       disableRedirect: false,
    })
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div>
      <button onClick={LoginUser}>
        Login With Google
      </button>
    </div>
  )
}

export default Login