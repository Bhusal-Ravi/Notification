import {useEffect, useState} from 'react'
import Update from './ui/Update'
import TelegramStatus from './ui/TelegramStatus'
import { RefreshCcw } from 'lucide-react';
import { authClient } from '../../lib/auth-client';





type UserInfoRow= {
  taskname:string
  taskdescription:string
  fixed_notify_time:string
  timezone:string 
  notify_after: string
}

type UserStreak={
  taskname:string
  count:number
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

function App() {
  const { data: session, isPending } = authClient.useSession()
  const [userid,setUserId]= useState<string>('')
  const [userinfo,setUserInfo]=useState<UserInfoRow[]>([])
  const [userStreak,setUserStreak]= useState<UserStreak[]>([])
  const [loadinginfo,setLoadingInfo]= useState<boolean>(false)
   const [loadingstreak,setLoadingStreak]= useState<boolean>(false)
  const totalActiveTasks:number = userinfo.length
  const uniqueTimezones:number = new Set(userinfo.map(task => task.timezone)).size
  const intervalDriven:number = userinfo.filter(task => task.notify_after && task.notify_after !== '0')?.length
  const currentlyWatching:number= userStreak?.length ?? 0
  const userActivityCount:number = userStreak.reduce((acc,curr)=>curr.count ? acc + curr.count : acc ,0  )

  async function fetchUser(email: string) {
    try {
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response = await fetch(`${base}/api/userexist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const result = await response.json()
      if (response.ok && result.status === 'pass' && result.data?.userid) {
        setUserId(result.data.userid)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  useEffect(() => {
    if (!isPending && session?.user?.email) {
      fetchUser(session.user.email)
    }
  }, [session, isPending])

  async function fetchUserinfo(){
    try{
      setLoadingInfo(true)
      if(!userid) return
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response= await fetch(`${base}/api/userinfo/${userid}` ,{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
          
        },
        credentials:"include"
      })
      const result= await response.json()
      if(!response.ok){
        throw new Error (result?.message)
      }

      const parsedData = Array.isArray(result?.data) ? result.data : []
      setUserInfo(parsedData)
      console.log(result?.data)

    }catch(error){
      console.log(error)
    }finally{
    setLoadingInfo(false)
  }
  }

  async function fetchUserStreak(){
    try{
      setLoadingStreak(true)
      if(!userid) return
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response= await fetch(`${base}/api/userstreak/${userid}` ,{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
          
        },
        credentials:"include"
      })
      const result= await response.json()
      if(!response.ok){
        throw new Error (result.message)
      }

      const parsedData = Array.isArray(result?.data) ? result.data : []
      setUserStreak(parsedData)

      console.log(result.data)
    }catch(error){
      console.log(error)
    }finally{
      setLoadingStreak(false)
    }
  }

  useEffect(()=>{
    if(userid){
      fetchUserinfo()
      fetchUserStreak()
    }
  },[userid])

  return (
    <div className='min-h-screen w-full flex flex-col items-center px-4 py-8 sm:px-8 lg:px-0'>
      <section className='w-full max-w-6xl mb-8'>
        <TelegramStatus email={session?.user?.email} />
      </section>
      <section className='w-full max-w-6xl relative border-[4px] border-black rounded-[32px] bg-[#fefefe] px-6 py-10 sm:px-10 shadow-[12px_12px_0_#0b0b0d] overflow-hidden'>
        <div className='pointer-events-none absolute -top-16 -right-10 h-48 w-48 rotate-[12deg] border-[4px] border-black bg-[#7df9ff] opacity-50'></div>
        <div className='pointer-events-none absolute -bottom-12 -left-6 h-40 w-40 rotate-6 border-[4px] border-black bg-[#ffff00] opacity-60'></div>

        <div className='relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex   items-center'>
            <p className='inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]'>
              Subscriptions Live
            </p>
           <div className='relative ml-[25px] w-10 h-10 px-4 py-1 group'>
              <button disabled={loadinginfo} onClick={fetchUserinfo} className=' flex items-center group-hover:bg-[#08a036] justify-center absolute inset-0 z-10 h-full w-full group cursor-pointer shadow-[6px_6px_0_#0b0b0d] bg-[#2FFF2F]  justify-center'>
                  {loadinginfo ? (
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
                      
                      </span>):<RefreshCcw />
    }
              </button>
           <span className='absolute inset-0 z-9 translate-all duration-200 bg-[#7DF9FF] h-full w-full group-hover:-translate-x-3 group-hover:-translate-y-3'></span>
           <span className='absolute inset-0 z-9 bg-[#FF9F66] translate-all duration-200 h-full w-full group-hover:translate-x-5 group-hover:translate-y-5'></span>
           </div>

            </div>
            <h1 className='mt-4 text-3xl font-black uppercase leading-tight text-[#0b0b0d] sm:text-[44px]'>Notification Subscription Hub</h1>
            <p className='mt-3 max-w-lg text-base font-medium text-[#333]'>Dashboard to view your active notification subscriptions.</p>
          </div>

          <div className='grid w-full gap-3 sm:w-auto sm:grid-col-1 md:grid-cols-2'>
            <div className='border-[4px] border-black bg-[#7df9ff] px-5 py-4 text-left shadow-[6px_6px_0_#0b0b0d]'>
              <p className='text-xs font-semibold uppercase tracking-widest'>Active Flows</p>
              <p className='text-4xl font-black'>{totalActiveTasks.toString().padStart(2,'0')}</p>
            </div>
            <div className='border-[4px] border-black bg-[#ff9f66] px-5 py-4 text-left shadow-[6px_6px_0_#0b0b0d]'>
              <p className='text-xs font-semibold uppercase tracking-widest'>Timezones Synced</p>
              <p className='text-4xl font-black'>{uniqueTimezones.toString().padStart(2,'0')}</p>
            </div>
            <div className='border-[4px] border-black bg-[#f7f7f7] px-5 py-4 text-left shadow-[6px_6px_0_#0b0b0d] sm:col-span-2'>
              <p className='text-xs font-semibold uppercase tracking-widest'>Interval Based</p>
              <p className='text-3xl font-black'>{intervalDriven.toString().padStart(2,'0')}</p>
            </div>
          </div>
        </div>

        <div className='relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {userinfo.map((data) => (
            <div key={data.taskname} className='bg-black rounded-2xl '>
            <article
              className='group border-[4px] h-full w-full border-black  rounded-2xl p-4 -translate-x-2 -translate-y-2 transition duration-200 hover:-translate-y-3 hover:-translate-x-3 hover:bg-[#ffe6c7] bg-[#fff9ef]'
            >
              <header className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#555]'>Task</p>
                  <h3 className='text-2xl font-black text-[#0b0b0d]'>{data.taskname}</h3>
                </div>
                <span className='border-[3px] border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0_#0b0b0d]'>#{data.taskname.slice(0,4).toUpperCase()}</span>
              </header>

              <p className='mt-4 text-sm font-medium leading-relaxed text-[#333]'>{data.taskdescription}</p>

              <div className='mt-6 space-y-3'>
                <div className='flex flex-col gap-2 border-[3px] border-black bg-[#ffff00] px-3 py-2 text-sm font-semibold shadow-[4px_4px_0_#0b0b0d] sm:flex-row sm:items-center sm:justify-between'>
                  <span className='uppercase tracking-[0.2em] text-[#0b0b0d]'>Notify At</span>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='border-[3px] border-black bg-white px-3 py-1 shadow-[3px_3px_0_#0b0b0d]'>
                      {data.taskname==='Drink Water'?'Interval':data.taskname==='Mid Night Report'?'Mid Night':data.fixed_notify_time}
                    </span>
                    <span className='border-[3px] border-black bg-white px-3 py-1 shadow-[3px_3px_0_#0b0b0d]'>{data.timezone}</span>
                  </div>
                </div>

                <div className='flex flex-col gap-2 border-[3px] border-black bg-[#7df9ff] px-3 py-2 text-sm font-semibold text-[#0b0b0d] shadow-[4px_4px_0_#0b0b0d] sm:flex-row sm:items-center sm:justify-between'>
                  <span className='uppercase tracking-[0.2em]'>Cadence</span>
                  <span className='border-[3px] border-black bg-white px-3 py-1 shadow-[3px_3px_0_#0b0b0d]'>
                    {data.taskname==='Mid Night Report'?'1 Day':data.notify_after || '—'}
                  </span>
                </div>
              </div>
            </article>
            </div>
          ))}

          {userinfo.length === 0 && (
            <div className='col-span-full border-[4px] border-dashed border-black bg-white px-5 py-12 text-center shadow-[8px_8px_0_#0b0b0d]'>
              <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#666]'>No Subscriptions Yet</p>
              <p className='mt-2 text-xl font-black text-[#0b0b0d]'>Wire up a notification to watch it land here.</p>
            </div>
          )}
        </div>
      </section>

      <section className='mt-8 w-full relative max-w-6xl overflow-hidden border-[4px] border-black bg-[#fefefe] px-6 py-8 text-center shadow-[10px_10px_0_#0b0b0d]'>
        <div className='pointer-events-none z-0   border-5 opacity-70 border-[#272928] -top-20 -right-20 sm:-top-10 sm:-right-15 transition-all bg-[#ff9f66] rounded-full h-48 w-48 rotate-45 absolute'></div>
         <div className='pointer-events-none z-0  border-5 opacity-70 border-[#272928] -bottom-10 -left-20 sm:-bottom-10 sm:-right-15 bg-[#2fff2f] rounded-full h-48 w-48 rotate-45 absolute'></div>
          <div className='  flex flex-col sm:flex-row sm:justify-between items-center relative'>
            <div className='w-full'>
              <div className='flex flex-wrap items-center gap-3'>
                <p className='inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]'>
                  Daily Streak Monitor
                </p>
                <div className='relative h-10 w-10 group'>
                  <button
                    type='button'
                    disabled={loadingstreak}
                    onClick={fetchUserStreak}
                    className='absolute inset-0 z-10 flex h-full w-full items-center justify-center border-[3px] border-black bg-[#2fff2f] shadow-[6px_6px_0_#0b0b0d] transition-colors group-hover:bg-[#08a036]'
                  >
                    {loadingstreak ? (
                      <svg
                        className='h-4 w-4 animate-spin text-black'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                        />
                      </svg>
                    ) : (
                      <RefreshCcw size={16} />
                    )}
                  </button>
                  <span className='absolute inset-0 bg-[#7df9ff] transition duration-200 group-hover:-translate-x-3 group-hover:-translate-y-3'></span>
                  <span className='absolute inset-0 bg-[#ff9f66] transition duration-200 group-hover:translate-x-5 group-hover:translate-y-5'></span>
                </div>
              </div>
            <h2 className='mt-4 text-3xl sm:text-[44px] leading-tight font-black uppercase text-left text-[#0b0b0d]'>Your Daily Streak</h2>
            <p className='mt-1 mb-5 text-left  text-base font-medium text-[#133c1b]'>These are the inputs from your side</p>
          </div>
          <div className='grid grid-cols-1 w-full sm:w-auto sm:grid-cols-2  gap-3'>
            <div className=' bg-black '>
                <span className='bg-[#2fff2f] h-full block -translate-x-1 px-4 py-4 text-left border-[4px] -translate-y-1'>
                  <p className='text-xs font-semibold uppercase tracking-widest'>Currently Watching</p>
                <p className='text-4xl font-black'>{currentlyWatching.toString().padStart(2,'0')}</p>
                  </span>
                  </div>
             <div className=' bg-black '>
                <span className='bg-[#7df9ff] h-full block -translate-x-1 px-5 py-4 text-left border-[4px] -translate-y-1'>
                  <p className='text-xs font-semibold uppercase tracking-widest'>User Activity Count</p>
                  
                  <p className='text-4xl font-black'>{userActivityCount.toString().padStart(2,'0')}</p>
                  </span>
                  </div>
             <div className=' bg-black sm:col-span-2 '>
                <span className='bg-[#ffff00] block -translate-x-1 px-5 py-4 text-left border-[4px] -translate-y-1'>
                  <p className='text-xs font-semibold uppercase tracking-widest'>Date Today</p>
                  <p className='text-4xl font-black'>{new Date().toDateString()}</p>
                  </span>
                  </div>
          </div>

          
          </div>
          {/* problem */}
          <div className='relative z-10 '>
          {userStreak.length>0 ?(<div className='mt-10 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
            {userStreak && userStreak.map((data)=>(
              <div key={data.taskname} className='bg-black rounded-2xl'>
                <div className='flex h-full flex-col gap-4 rounded-2xl border-[4px] border-black  bg-[#fff9ef] px-4 py-4 text-left -translate-x-2 -translate-y-2 shadow-[6px_6px_0_#0b0b0d] transition duration-200 hover:-translate-x-3 hover:-translate-y-3 hover:bg-[#ffe6c7]'>
                  <h1 className='text-2xl font-black text-[#0b0b0d]'>{data.taskname} Logs</h1>
                  <div className='flex flex-col gap-2 border-[3px] border-black bg-[#ffff00] px-3 py-2 text-sm font-semibold uppercase text-[#0b0b0d] shadow-[4px_4px_0_#0b0b0d] sm:flex-row sm:items-center sm:justify-between'>
                    <span className='tracking-[0.2em]'>Count</span>
                    <span className='border-[3px] border-black bg-white px-3 py-1 text-2xl font-black shadow-[3px_3px_0_#0b0b0d]'>
                      {data.count.toString().padStart(2,'0')}
                    </span>
                  </div>
                  <p className='text-sm font-medium text-[#333]'>
                    {data.taskname==="Drink Water"?"Number of times you have logged your water intake":data.taskname==='Daily Exercise'?"Logged daily exercise sessions":data.taskname==="Study Session"?"Total daily study sessions":""}
                  </p>
                </div>
              </div>
            ))}
          </div>):
                 <div className='col-span-full border-[4px] mt-5 border-dashed border-black bg-white px-5 py-12 text-center shadow-[8px_8px_0_#0b0b0d]'>
              <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#666]'>No Input from the user</p>
              <p className='mt-2 text-xl font-black text-[#0b0b0d]'>Log in your inputs in the telegram bot to watch it land here</p>
            </div>
            }
          </div>
      </section>


      <section className='mt-8 w-full relative max-w-6xl  border-[4px] border-black bg-[#fefefe] px-6 py-8 text-center shadow-[10px_10px_0_#0b0b0d]'>
          <Update userid={userid}/>
      </section>
    </div>
  )
}

export default App
