import React, { useEffect, useState } from 'react'
import { authClient } from '../../lib/auth-client'



function Welcome({children}) {
  const [fname,setFname]= useState('')
  const [lname,setLname]= useState('')
  const [loading,setLoading]= useState(false)

   const { data: session, isPending } = authClient.useSession()
 
   async function getUserStatus(){
      try{
        setLoading(true)
        const response= await fetch('http://localhost:3000/api/userexist',{
          method:'POST',
          credentials:'include',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({email:session?.user?.email})
        })
        const result= await response.json()
        console.log(result)
        
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false)
      }
   }

   useEffect(()=>{
    if(session?.user?.email){
      getUserStatus()
    }
   },[session])
  return (
    <div className='mt-10 flex flex-col justify-center items-center max-w-5xl'>
      <div className='flex justify-center items-center flex-col'>
        <h1 className='text-2xl'>You have logged in as</h1>
        <div className='flex justify-center items-center mt-2'>
          <p className='bg-black h-15 w-15 rounded-full group mr-5'><img className='rounded-full border-[4px] group-hover:translate-x-0 group-hover:translate-y-0 transfom-all duration-200 block -translate-x-[3px] -translate-y-[3px]' src={`${session?.user.image}`}/></p>
          <p className='text-xl'>{session?.user.email}</p>
        </div>
        </div>

        <form className='flex flex-col'>
          <p>Before we continue, Lets us know what do you want to be called</p>
          <p>Note: Every notification will use this name</p>
          <div className='flex flex-col justify-center items-center'>
          <label>First Name</label>
          <input type='text' value={fname} onChange={(e)=>setFname(e.target.value)} />
          </div>
          <div className='flex flex-col justify-center items-center'>
          <label>Last Name</label>
          <input type='text' value={lname} onChange={(e)=>setLname(e.target.value)} />
          </div>
          <button>Confirm</button>
        </form>
      
      
    </div>
  )
}

export default Welcome