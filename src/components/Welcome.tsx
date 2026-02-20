import { useEffect, useRef, useState } from 'react'
import { authClient } from '../../lib/auth-client'
import { AnimatePresence, motion } from 'framer-motion'

import type { ReactNode } from 'react';
import AnimateUser from './AnimateUser';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')


// type Data= {
//   userid:string
//   createdat:string,
//   fname:string,
//   lname:string,
//   email:string

// }

type Props={
  children: ReactNode;
}

function Welcome({children}:Props) {
  const [fname,setFname]= useState('')
  const [lname,setLname]= useState('')
  const [loading,setLoading]= useState(false)
  const [checkLoading,setcheckLoading]= useState(false)
  
  
  const [canmove,setCanMove]= useState(false)
  const [imgError, setImgError] = useState(false)
  const [statusCards, setStatusCards] = useState<{id:number; text:string; variant:'success'|'error'}[]>([])
  const messageIdRef = useRef(0)
  const timeoutsRef = useRef<number[]>([])
  const hasCheckedRef = useRef(false)
 


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
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response= await fetch(`${base}/api/setuserinfo`,{
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
        const base = API_BASE_URL ? `${API_BASE_URL}` : ''
        const response= await fetch(`${base}/api/userexist`,{
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

      
        if(result.status==='pass'){
          setCanMove(true)
        }


        
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false)
        setcheckLoading(false)
      }
   }

   useEffect(()=>{
    if(session?.user?.email && !hasCheckedRef.current){
      setcheckLoading(true)
      getUserStatus(session.user.email)
      hasCheckedRef.current = true
    }
   },[session?.user?.email])

   useEffect(()=>{

   },[canmove])

   function handleUserSet(){
      
    if(!session?.user.email){
      return 
    }
    updateUserInfo(session.user.email)
   }

   if(isPending ){
    return <div className='mt-10 flex justify-center items-center'>Loading session...</div>
   }

   if(checkLoading) return <AnimateUser/>

   if( canmove  ) {
    return children
   }

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-0'>
      {/* Status toast cards */}
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

      <section className='w-full max-w-xl relative border-[4px] border-black rounded-[32px] bg-[#fefefe] px-8 py-10 shadow-[12px_12px_0_#0b0b0d] overflow-hidden'>
        {/* Decorative shapes */}
        <div className='pointer-events-none absolute -top-16 -right-10 h-48 w-48 rotate-[12deg] border-[4px] border-black bg-[#7df9ff] opacity-50'></div>
        <div className='pointer-events-none absolute -bottom-12 -left-6 h-40 w-40 rotate-6 border-[4px] border-black bg-[#ffff00] opacity-60'></div>

        <div className='relative flex flex-col items-center gap-6'>
          {/* User avatar + email */}
          <div className='flex flex-col items-center gap-3'>
            <p className='inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]'>
              Welcome
            </p>
            <h1 className='mt-2 text-3xl font-black uppercase leading-tight text-[#0b0b0d] text-center'>You have logged in as</h1>

            <div className='flex items-center gap-4 mt-2'>
              {session?.user.image && !imgError ? (
                <div className='bg-black h-14 w-14 rounded-full group flex-shrink-0'>
                  <img
                    className='rounded-full border-[4px] border-black h-14 w-14 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 block -translate-x-[3px] -translate-y-[3px]'
                    src={`${session?.user.image}`}
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className='bg-black h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 border-[4px] border-black'>
                  <span className='text-white text-xl font-black'>{session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase()}</span>
                </div>
              )}
              <p className='text-lg font-semibold text-[#333] break-all'>{session?.user.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className='w-full border-t-[3px] border-dashed border-black pt-6'>
            <p className='text-base font-bold text-[#0b0b0d]'>Before we continue, let us know what you want to be called</p>
            <p className='mt-1 text-sm font-medium text-[#555]'>Note: Every notification will use this name</p>

            <div className='mt-6 flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold uppercase tracking-[0.2em] text-[#0b0b0d]'>First Name</label>
                <input
                  type='text'
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className='border-[3px] border-black px-4 py-2 text-sm font-semibold shadow-[4px_4px_0_#0b0b0d] outline-none focus:shadow-[6px_6px_0_#0b0b0d] focus:bg-[#fffbe6] transition-all'
                  placeholder='John'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold uppercase tracking-[0.2em] text-[#0b0b0d]'>Last Name</label>
                <input
                  type='text'
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className='border-[3px] border-black px-4 py-2 text-sm font-semibold shadow-[4px_4px_0_#0b0b0d] outline-none focus:shadow-[6px_6px_0_#0b0b0d] focus:bg-[#fffbe6] transition-all'
                  placeholder='Doe'
                />
              </div>
            </div>

            <div className='mt-6 flex justify-center'>
              <div className='bg-black rounded-md'>
                <button
                  disabled={loading}
                  type='button'
                  onClick={handleUserSet}
                  className='bg-[#c1ff72] block px-8 py-3 -translate-x-1 -translate-y-1 border-black border-[3px] rounded-md text-sm font-black uppercase tracking-[0.2em] hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <span className='flex items-center gap-2'>
                      <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
                      </svg>
                      Saving...
                    </span>
                  ) : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Welcome