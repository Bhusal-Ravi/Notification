import { useEffect, useState, useRef } from 'react'
import TimezoneSelect from "react-timezone-select"
import { authClient } from '../../lib/auth-client'
import { AnimatePresence, motion } from 'framer-motion'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

type first ={
    title:string
    interval:string,
    timezone:string
}

type second={
    title:string
    fixed_notify_time:string
    timezone:string
}

type third= {
    title:string
    fixed_notify_time:string
    fixed_notify_date:string
    timezone:string
}

type CustomNotificationProps = {
  setCustomNotification: React.Dispatch<React.SetStateAction<boolean>>
}


function CustomNotification({setCustomNotification}: CustomNotificationProps) {
    const { data: session, isPending } = authClient.useSession()
    const email= session?.user?.email
    const [check,setCheck] = useState('first')
    const [firstData,setFirstData]= useState<first>({title:'', interval:'', timezone:''})
    const [secondData,setSecondData]= useState<second>({title:'', fixed_notify_time:'', timezone:''})
    const [thirdData,setThirdData]= useState<third>({title:'',fixed_notify_time:'',fixed_notify_date:'',timezone:''})
    const [intervalError,setIntervalError]= useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [statusCards, setStatusCards] = useState<{id:number; text:string; variant:'success'|'error'}[]>([])
    const messageIdRef = useRef(0)
    const timeoutsRef = useRef<number[]>([])


        useEffect(()=>{
            return () => {
                timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId))
                timeoutsRef.current = []
            }
        },[])

        const showStatusCard = (text: string, variant: 'success' | 'error' = 'success') => {
            const id = messageIdRef.current++
            setStatusCards(prev => [...prev, { id, text, variant }])
            const timeoutId = window.setTimeout(() => {
                setStatusCards(prev => prev.filter(card => card.id !== id))
            }, 3000)
            timeoutsRef.current.push(timeoutId)
        }

        async function saveNotification(type:string){
            setLoading(true)
            try{
                let payload
                if(type==='first'){
                 payload = {notify_after:firstData?.interval,title:firstData?.title, timezone: firstData?.timezone,email:email,type:type}
                }else if (type==='second'){
                    payload= {fixed_notify_time:secondData?.fixed_notify_time,title:secondData?.title, timezone: secondData?.timezone,email:email,type:type}
                }else {
                    payload= {fixed_notify_time:thirdData.fixed_notify_time,title:thirdData?.title,fixed_notify_date:thirdData.fixed_notify_date, timezone: thirdData.timezone,email:email,type:type}
                }

                const base = API_BASE_URL ? `${API_BASE_URL}` : ''
                const response = await fetch(`${base}/api/customnotification`,{
                  method:'PUT',
                  credentials:"include",
                  headers:{
                    'Content-Type':'application/json'
                  },
                  body:JSON.stringify({...payload})
                })

                const result = await response.json()
                
                if(!response.ok){
                    throw new Error(result.message)
                }

                const message = typeof result?.message === 'string' && result.message.length > 0
                    ? result.message
                    : 'Successfully created your notification'
                showStatusCard(message, 'success')

                // Clear form data
                if(type==='first'){
                    setFirstData({title:'', interval:'', timezone:''})
                }else if(type==='second'){
                    setSecondData({title:'', fixed_notify_time:'', timezone:''})
                }else{
                    setThirdData({title:'',fixed_notify_time:'',fixed_notify_date:'',timezone:''})
                }

            }catch(error){
                const message = error instanceof Error ? error.message : 'Failed to create notification'
                showStatusCard(message, 'error')
            }finally{
                setLoading(false)
            }
        }


        function handleCheck(task:string){
            if(check===task){
                setCheck('')
            }else setCheck(task)
            setIntervalError('')
        }

        function handleFirst(value:string){

             if(!firstData?.title?.length){
               setIntervalError('Enter a title before confirming')
               return setTimeout(()=>{
                    setIntervalError('')
               },3000)
             }

             if(!firstData?.timezone?.length){
               setIntervalError('Select a timezone before confirming')
               return setTimeout(()=>{
                    setIntervalError('')
               },3000)
             }

             let status=/^\d+\s+(minute|hour|day)s?$/.test(value.trim())
             let time = value[0]
             
             if(!status || (Number(time)<=0)){
               setIntervalError("Interval has to be in this format: [1 hour , 5 hours , 1 minute , 15 minutes etc]")
               return setTimeout(()=>{
                    setIntervalError('')
               },3000)

                
             }
             saveNotification("first")


        }

        function handleSecond(){
           if(!secondData?.title?.length){
                setIntervalError('Enter a title before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
           }
           if(!secondData?.fixed_notify_time.length){
                setIntervalError('Enter Time before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
           }
           if(!secondData?.timezone.length){
                setIntervalError('Select a timezone before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
           }

           saveNotification("second")
        }

        function handleThird(){
            if(!thirdData.title.length){
                setIntervalError('Enter a title before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
            }
            if(!thirdData.fixed_notify_date.length || !thirdData.fixed_notify_time.length){
                
                 setIntervalError('Enter Both Date and Time before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
                }
            if(!thirdData.timezone.length){
                setIntervalError('Select a timezone before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
            }
            
            saveNotification("third")
        }

  return (
    <div className='relative bg-black/50  z-20 flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-6 py-10'>
        {/* Status Cards */}
        <button 
          className='absolute cursor-pointer top-2 right-5 border-[3px] border-black bg-[#ffb5bd] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1' 
          onClick={()=>setCustomNotification(prev=>!prev)}
        >
          Cancel
        </button>
        <div className="fixed top-6  right-6 z-50 flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {statusCards.map(card => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        transition={{ duration: 0.3 }}
                        className={`px-6 py-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] font-medium ${
                            card.variant === 'success' 
                                ? 'bg-[#90EE90] text-black' 
                                : 'bg-[#ff6b6b] text-white'
                        }`}
                    >
                        {card.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Notification Type Selector */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10'>
            <button onClick={()=>handleCheck('first')} className={`text-left p-5 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-y-1 ${check==='first' ? 'bg-[#ffff00]' : 'bg-white'}`}>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='font-bold text-lg'>Interval</h2>
                <div className={`w-5 h-5 rounded-sm border-2 border-black flex items-center justify-center ${check==='first' ? 'bg-black' : 'bg-white'}`}>
                  {check==='first' && <span className='text-white text-xs font-black'>✓</span>}
                </div>
              </div>
              <p className='text-sm leading-relaxed'>Sent after a user-specified interval, e.g. every 1 hour, 15 minutes, 2 days</p>
            </button>

            <button onClick={()=>handleCheck('second')} className={`text-left p-5 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-y-1 ${check==='second' ? 'bg-[#4ecdc4]' : 'bg-white'}`}>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='font-bold text-lg'>Daily Fixed Time</h2>
                <div className={`w-5 h-5 rounded-sm border-2 border-black flex items-center justify-center ${check==='second' ? 'bg-black' : 'bg-white'}`}>
                  {check==='second' && <span className='text-white text-xs font-black'>✓</span>}
                </div>
              </div>
              <p className='text-sm leading-relaxed'>Sent each day at a fixed time, e.g. exercise reminder at 3:45 PM</p>
            </button>

            <button onClick={()=>handleCheck('third')} className={`text-left p-5 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-y-1 ${check==='third' ? 'bg-[#a78bfa]' : 'bg-white'}`}>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='font-bold text-lg'>One-Time</h2>
                <div className={`w-5 h-5 rounded-sm border-2 border-black flex items-center justify-center ${check==='third' ? 'bg-black' : 'bg-white'}`}>
                  {check==='third' && <span className='text-white text-xs font-black'>✓</span>}
                </div>
              </div>
              <p className='text-sm leading-relaxed'>Sent once at a fixed date and time, e.g. meeting at 10:00 AM on 2026/04/08</p>
            </button>
        </div>

        {/* Input Section */}
        <div className='w-full'>
            {check==='first' ? (
              <div className='bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6'>
                <h2 className='font-bold text-xl mb-1'>Frequently Repeating Notifications</h2>
                <p className='text-sm mb-4 text-gray-600'>Enter an interval like "1 hour", "15 minutes", or "2 days"</p>
                <div className='flex flex-col gap-3'>
                  <input
                    className='w-full px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#ffff00]'
                    onChange={(e)=>setFirstData((prev)=>({...prev, title:e.target.value}))}
                    type='text'
                    placeholder='Notification title'
                  />
                  <div>
                    <p className='mb-2 text-xs font-bold uppercase tracking-widest'>Timezone</p>
                    <div className='border-2 border-black bg-white rounded-md'>
                      <TimezoneSelect
                        value={firstData.timezone}
                        onChange={(e) =>
                          setFirstData((prev) => ({
                            ...prev,
                            timezone: e.value
                          }))
                        }
                      />
                    </div>
                  </div>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    className='flex-1 px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#ffff00]'
                    onChange={(e)=>setFirstData((prev)=>({...prev, interval:e.target.value}))}
                    type='text'
                    placeholder='e.g. 1 hour'
                  />
                  <button onClick={()=>handleFirst(firstData?.interval??"")} disabled={loading} className='bg-black rounded-md'>
                    <span className={`bg-[#ffff00] block px-6 py-3 -translate-x-1 -translate-y-1 border-black border-2 rounded-md font-bold transition-all ${
                      loading ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0'
                    }`}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="h-5 w-5 animate-spin text-black"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm'
                      )}
                    </span>
                  </button>
                </div>
                </div>
                <div className='h-6 mt-2'>{intervalError && <p className='text-[#ff6b6b] font-medium text-sm'>{intervalError}</p>}</div>
              </div>
            ) : check==='second' ? (
              <div className='bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6'>
                <h2 className='font-bold text-xl mb-1'>Daily Repeating Notifications</h2>
                <p className='text-sm mb-4 text-gray-600'>Pick a time — you'll be notified every day at this time</p>
                <div className='flex flex-col gap-3'>
                  <input
                    className='w-full px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]'
                    onChange={(e)=>setSecondData((prev)=>({...prev, title:e.target.value}))}
                    type='text'
                    placeholder='Notification title'
                  />
                  <div>
                    <p className='mb-2 text-xs font-bold uppercase tracking-widest'>Timezone</p>
                    <div className='border-2 border-black bg-white rounded-md'>
                      <TimezoneSelect
                        value={secondData.timezone}
                        onChange={(e) =>
                          setSecondData((prev) => ({
                            ...prev,
                            timezone: e.value
                          }))
                        }
                      />
                    </div>
                  </div>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    className='flex-1 px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]'
                    onChange={(e)=>setSecondData((prev)=>({...prev, fixed_notify_time:e.target.value}))}
                    type='time'
                  />
                  <button onClick={handleSecond} disabled={loading} className='bg-black rounded-md'>
                    <span className={`bg-[#4ecdc4] block px-6 py-3 -translate-x-1 -translate-y-1 border-black border-2 rounded-md font-bold transition-all ${
                      loading ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0'
                    }`}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="h-5 w-5 animate-spin text-black"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm'
                      )}
                    </span>
                  </button>
                </div>
                </div>
                <div className='h-6 mt-2'>{intervalError && <p className='text-[#ff6b6b] font-medium text-sm'>{intervalError}</p>}</div>
              </div>
            ) : (
              <div className='bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6'>
                <h2 className='font-bold text-xl mb-1'>One-Time Notification</h2>
                <p className='text-sm mb-4 text-gray-600'>Pick a date and time — you'll be notified exactly once</p>
                <div className='flex flex-col gap-3'>
                  <input
                    className='w-full px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#a78bfa]'
                    onChange={(e)=>setThirdData((prev)=>({...prev, title:e.target.value}))}
                    type='text'
                    placeholder='Notification title'
                  />
                  <div>
                    <p className='mb-2 text-xs font-bold uppercase tracking-widest'>Timezone</p>
                    <div className='border-2 border-black bg-white rounded-md'>
                      <TimezoneSelect
                        value={thirdData.timezone}
                        onChange={(e) =>
                          setThirdData((prev) => ({
                            ...prev,
                            timezone: e.value
                          }))
                        }
                      />
                    </div>
                  </div>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    className='flex-1 px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#a78bfa]'
                    onChange={(e)=>setThirdData((prev)=>({...prev,fixed_notify_time:e.target.value}))}
                    type='time'
                  />
                  <input
                    className='flex-1 px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#a78bfa]'
                    onChange={(e)=>setThirdData((prev)=>({...prev,fixed_notify_date:e.target.value}))}
                    min={new Date().toISOString().split("T")[0]}
                    type='date'
                  />
                  <button onClick={handleThird} disabled={loading} className='bg-black rounded-md'>
                    <span className={`bg-[#a78bfa] block px-6 py-3 -translate-x-1 -translate-y-1 border-black border-2 rounded-md font-bold text-white transition-all ${
                      loading ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0'
                    }`}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="h-5 w-5 animate-spin text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm'
                      )}
                    </span>
                  </button>
                </div>
                </div>
                <div className='h-6 mt-2'>{intervalError && <p className='text-[#ff6b6b] font-medium text-sm'>{intervalError}</p>}</div>
              </div>
            )}
        </div>
    </div>
  )
}

export default CustomNotification