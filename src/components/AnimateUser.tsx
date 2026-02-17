import  { useEffect, useState } from 'react'
import type { ReactNode } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { authClient } from '../../lib/auth-client';

type Props = {
  children: ReactNode;
};


function AnimateUser({children}:Props) {
    const [canmove,setCanMove]= useState(false)
    const [imgError, setImgError] = useState(false)
     const { data: session, isPending } = authClient.useSession()
      useEffect(()=>{
    setTimeout(()=>{
    setCanMove(true)
      },4000)
   },[canmove])
   if(isPending){
    return <div className='mt-10 flex justify-center items-center'>Loading session...</div>
   }
   if(canmove) return children
  

     return (
    <div className=' flex flex-col min-h-screen justify-center items-center'>
        <DotLottieReact
      src='animations/Hello.lottie'
      loop={false}
      autoplay
    />
    {session?.user?.image && !imgError ? (
      <p className='bg-black animate-bounce rounded-full group '>
        <img className='rounded-full border-[4px] group-hover:translate-x-0 group-hover:translate-y-0 transfom-all duration-200 block -translate-x-[3px] -translate-y-[2px]' src={`${session?.user.image}`} onError={() => setImgError(true)} />
      </p>
    ) : (
      <p className='bg-black animate-bounce rounded-full group h-12 w-12 flex items-center justify-center'>
        <span className='text-white text-xl font-bold'>{session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase()}</span>
      </p>
    )}
    </div>
  )
}

export default AnimateUser