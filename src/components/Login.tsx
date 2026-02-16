
import {authClient} from '../../lib/auth-client'






const auth_callbackurl = (import.meta.env.VITE_CALLBACK_URL ?? '').replace(/\/+$/, '')
const auth_newUserCallbackURL = (import.meta.env.VITE_NEW_USER_CALLBACK_URL ?? '').replace(/\/+$/, '')
function Login() {

  async function LoginUser(){
   
   try{ 
    await authClient.signIn.social({
      provider:'google',
      callbackURL:auth_callbackurl,
      
      newUserCallbackURL:auth_newUserCallbackURL,
       disableRedirect: false,
    })
    }catch(error){
      console.log(error)
    }
  }

   const { data: session,  } = authClient.useSession()

   

  if(!session) return (
    <button onClick={LoginUser} className='bg-black rounded-md'>
      <span className='bg-[#ffff00] block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
        Login With Google
      </span>
    </button>
  )
  return (
    <div className='bg-black rounded-md '>
       
      <span className='bg-[#ffff00] block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
        
      </span>
    
    </div>
  )
}

export default Login