import React, { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { authClient } from '../../lib/auth-client';

function AnimateUser({children}) {
    const [canmove,setCanMove]= useState(false)
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
      src='src/assets/animations/Hello.lottie'
      loop={false}
      autoplay
    />
    <p className='bg-black animate-bounce rounded-full group '><img className='rounded-full  border-[4px]  group-hover:translate-x-0 group-hover:translate-y-0 transfom-all duration-200 block -translate-x-[3px] -translate-y-[2px]' src={`${session?.user.image}`}/></p>
    </div>
  )
}

export default AnimateUser