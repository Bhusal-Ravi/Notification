import React, { useEffect, useRef, useState } from 'react'
import { authClient } from '../../lib/auth-client'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Message={
  status:string
  message:string
}
type Data= {
  userid:string
  createdat:string,
  fname:string,
  lname:string,
  email:string

}

function Welcome({children}) {
  const [fname,setFname]= useState('')
  const [lname,setLname]= useState('')
  const [loading,setLoading]= useState(false)
  const [data,setData]= useState<Data>()
  const [message,setMessage]= useState<Message>()
  const [canmove,setCanMove]= useState(false)
  const [statusCards, setStatusCards] = useState<{id:number; text:string; variant:'success'|'error'}[]>([])
  const messageIdRef = useRef(0)
  const timeoutsRef = useRef<number[]>([])
  const navigate = useNavigate()


   const { data: session, isPending } = authClient.useSession()

  const showStatusCard = (text: string, variant: 'success' | 'error' = 'success') => {
    const id = messageIdRef.current++
    setStatusCards(prev => [...prev, { id, text, variant }])
    const timeoutId = window.setTimeout(() => {
      setStatusCards(prev => prev.filter(card => card.id !== id))
    }, 1500)
    timeoutsRef.current.push(timeoutId)
  }

  async function updateUserInfo(email:string){
    try{
      if(!email || !fname || !lname){
        showStatusCard('Provide all the fields', 'error')
        return
      }
      setLoading(true)
      const response= await fetch(`http://localhost:3000/api/setuserinfo`,{
          method:'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          credentials:'include',
          body:JSON.stringify({email,fname:fname,lname:lname})
      })
      const result= await response.json();
      if(!response.ok){
        showStatusCard(result.message || 'Something went wrong', 'error')
        return
      }
      showStatusCard('User info updated successfully', 'success')
      setCanMove(true)
      console.log(result)
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

 
   async function getUserStatus(email:string){
      try{
        setLoading(true)
        const response= await fetch('http://localhost:3000/api/userexist',{
          method:'POST',
          credentials:'include',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({email})
        })
        const result= await response.json()

        
        if(!response.ok){
         return  showStatusCard('Failed to check users info','error')
        }

        setData(result.data)
        if(result.status==='pass'){
          setCanMove(true)
        }


        
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false)
      }
   }

   useEffect(()=>{
    if(session?.user?.email){
      getUserStatus(session.user.email)
    }
   },[session])

   useEffect(()=>{

   },[canmove])

   function handleUserSet(){
      
    if(!session?.user.email){
      return 
    }
    updateUserInfo(session.user.email)
   }

   if(isPending){
    return <div className='mt-10 flex justify-center items-center'>Loading session...</div>
   }

   if( canmove  ) {
    return children
   }

  return (
    <div className='mt-10 flex flex-col justify-center items-center max-w-5xl'>
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {statusCards.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ type: 'spring', stiffness: 250, damping: 24 }}
              className={`pointer-events-auto border-[4px] border-black rounded-2xl px-5 py-3 shadow-[10px_10px_0_#0b0b0d] text-sm font-black uppercase tracking-wider ${
                card.variant === 'success'
                  ? 'bg-[#c1ff72] text-[#0b0b0d]'
                  : 'bg-[#ffb5bd] text-[#0b0b0d]'
              }`}
            >
              {card.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className='flex justify-center items-center flex-col'>
        <h1 className='text-2xl'>You have logged in as</h1>
        <div className='flex justify-center items-center mt-2'>
          {session?.user.image&& (<p className='bg-black h-15 w-15 rounded-full group mr-5'><img className='rounded-full border-[4px] group-hover:translate-x-0 group-hover:translate-y-0 transfom-all duration-200 block -translate-x-[3px] -translate-y-[3px]' src={`${session?.user.image}`}/></p>)}
          <p className='text-xl'>{session?.user.email}</p>
        </div>
        </div>

        <form className='flex flex-col'>
          <p>Before we continue, Lets us know what do you want to be called</p>
          <p>Note: Every notification will use this name</p>
          <div className='flex flex-col justify-center items-center'>
          <label>First Name</label>
          <input type='text' value={fname}  onChange={(e)=>setFname(e.target.value)} />
          </div>
          <div className='flex flex-col justify-center items-center'>
          <label>Last Name</label>
          <input type='text' value={lname} onChange={(e)=>setLname(e.target.value)} />
          </div>
          <button disabled={loading} type='button' onClick={handleUserSet}>Confirm</button>

        </form>
      
      
    </div>
  )
}

export default Welcome