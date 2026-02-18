import { useEffect, useState } from "react"
import { authClient } from "../../lib/auth-client"

import LoadingScreen from "./ui/Loading";

interface SessionVerifyProps {
    children: React.ReactNode
}

function Sessionverify({children}:SessionVerifyProps) {
       const { data: session, isPending } = authClient.useSession()
       
       const [allow,setAllow]= useState(false)

       useEffect(()=>{
            if(!isPending && session){
                setAllow(true)
            }
       },[session])

if(isPending) return <LoadingScreen/>


if(!allow){
    return (
         <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_black] p-10 max-w-xl w-full">
        <h1 className="text-5xl font-black mb-6 uppercase tracking-tight">
          403
        </h1>

        <h2 className="text-2xl font-bold mb-4">
          You are not authorized to visit this page.
        </h2>

        <p className="text-lg mb-8 font-medium">
          This area is restricted. If you believe this is a mistake, contact support.
        </p>

        <button
          onClick={() => window.history.back()}
          className="bg-black text-white border-4 border-black px-6 py-3 font-bold hover:bg-white hover:text-black transition-none"
        >
          Go Back
        </button>
      </div>
    </div>
    )
}

  return (
    children
  )
}

export default Sessionverify