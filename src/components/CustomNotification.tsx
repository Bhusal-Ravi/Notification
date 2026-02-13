import React, { useEffect, useState } from 'react'

type first ={
    interval:string,
}

type second={
    fixed_notify_time:string
}

type third= {
    fixed_notify_time:string
    fixed_notify_date:string
}

function CustomNotification() {
    const [check,setCheck] = useState('first')
    const [firstData,setFirstData]= useState<first>()
    const [secondData,setSecondData]= useState<second>()
    const [thirdData,setThirdData]= useState<third>({fixed_notify_time:'',fixed_notify_date:''})
    const [intervalError,setIntervalError]= useState<string>()


        useEffect(()=>{

        },[check,intervalError])

        async function saveNotification(type:string){
            try{
                let payload
                if(type==='first'){
                 payload = {notify_after:firstData?.interval}
                }else if (type==='second'){
                    payload= {fixed_notify_time:secondData?.fixed_notify_time}
                }else {
                    payload= {fixed_notify_time:thirdData.fixed_notify_time,fixed_notify_date:thirdData.fixed_notify_date}
                }

                const response = await fetch('') // TODO: add endpoint

            }catch(error){
                console.log(error)
            }
        }


        function handleCheck(task:string){
            if(check===task){
                setCheck('')
            }else setCheck(task)
            setIntervalError('')
        }

        function handleFirst(value:string){

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
           if(!secondData?.fixed_notify_time.length){
                setIntervalError('Enter  Time before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
           }


        }

        function handleThird(){
            if(!thirdData.fixed_notify_date.length || !thirdData.fixed_notify_time.length){
                
                 setIntervalError('Enter Both Date and Time before confirming')
                return setTimeout(()=>{
                    setIntervalError('')
                },3000)
                }
            
        }

  return (
    <div className='flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-6 py-10'>
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
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    className='flex-1 px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#ffff00]'
                    onChange={(e)=>setFirstData({interval:e.target.value})}
                    type='text'
                    placeholder='e.g. 1 hour'
                  />
                  <button onClick={()=>handleFirst(firstData?.interval??"")} className='bg-black rounded-md'>
                    <span className='bg-[#ffff00] block px-6 py-3 -translate-x-1 -translate-y-1 border-black border-2 rounded-md font-bold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                      Confirm
                    </span>
                  </button>
                </div>
                <div className='h-6 mt-2'>{intervalError && <p className='text-[#ff6b6b] font-medium text-sm'>{intervalError}</p>}</div>
              </div>
            ) : check==='second' ? (
              <div className='bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6'>
                <h2 className='font-bold text-xl mb-1'>Daily Repeating Notifications</h2>
                <p className='text-sm mb-4 text-gray-600'>Pick a time — you'll be notified every day at this time</p>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    className='flex-1 px-4 py-3 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]'
                    onChange={(e)=>setSecondData({fixed_notify_time:e.target.value})}
                    type='time'
                  />
                  <button onClick={handleSecond} className='bg-black rounded-md'>
                    <span className='bg-[#4ecdc4] block px-6 py-3 -translate-x-1 -translate-y-1 border-black border-2 rounded-md font-bold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                      Confirm
                    </span>
                  </button>
                </div>
                <div className='h-6 mt-2'>{intervalError && <p className='text-[#ff6b6b] font-medium text-sm'>{intervalError}</p>}</div>
              </div>
            ) : (
              <div className='bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-6'>
                <h2 className='font-bold text-xl mb-1'>One-Time Notification</h2>
                <p className='text-sm mb-4 text-gray-600'>Pick a date and time — you'll be notified exactly once</p>
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
                  <button onClick={handleThird} className='bg-black rounded-md'>
                    <span className='bg-[#a78bfa] block px-6 py-3 -translate-x-1 -translate-y-1 border-black border-2 rounded-md font-bold text-white hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                      Confirm
                    </span>
                  </button>
                </div>
                <div className='h-6 mt-2'>{intervalError && <p className='text-[#ff6b6b] font-medium text-sm'>{intervalError}</p>}</div>
              </div>
            )}
        </div>
    </div>
  )
}

export default CustomNotification