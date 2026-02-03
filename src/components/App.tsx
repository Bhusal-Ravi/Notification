import React,{useEffect, useState} from 'react'
import { Outlet } from 'react-router-dom'


type UserInfoRow= {
  taskname:string
  taskdescription:string
  fixed_notify_time:string
  timezone:string 
  notify_after: string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

function App() {
  const [userid,setUserId]= useState<string>('f06c9a03-5acd-4c32-a062-128563fc8f71')
  const [userinfo,setUserInfo]=useState<UserInfoRow[]>([])
  const totalActiveTasks = userinfo.length
  const uniqueTimezones = new Set(userinfo.map(task => task.timezone)).size
  const intervalDriven = userinfo.filter(task => task.notify_after && task.notify_after !== '0').length

  async function fetchUserinfo(){
    try{
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
        throw new Error (result.message)
      }

      setUserInfo(result.data)
      console.log(result.data)

    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchUserinfo()
  },[])

  return (
    <div className='min-h-screen w-full flex flex-col items-center px-4 py-8 sm:px-8 lg:px-0'>
      <section className='w-full max-w-6xl relative border-[4px] border-black rounded-[32px] bg-[#fefefe] px-6 py-10 sm:px-10 shadow-[12px_12px_0_#0b0b0d] overflow-hidden'>
        <div className='pointer-events-none absolute -top-16 -right-10 h-48 w-48 rotate-[12deg] border-[4px] border-black bg-[#7df9ff] opacity-50'></div>
        <div className='pointer-events-none absolute -bottom-12 -left-6 h-40 w-40 rotate-6 border-[4px] border-black bg-[#ffff00] opacity-60'></div>

        <div className='relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]'>
              Subscriptions Live
            </p>
            <h1 className='mt-4 text-3xl font-black uppercase leading-tight text-[#0b0b0d] sm:text-[44px]'>Notification Subscription Hub</h1>
            <p className='mt-3 max-w-lg text-base font-medium text-[#333]'>A loud, unapologetic dashboard that keeps every ritual on beat. Drag your eyes across the blocks, tap in, and trust the schedule.</p>
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
            <div key={data.taskname} className='bg-black rounded-2xl'>
            <article
              className='group border-[4px] border-black bg-[#fff9ef] rounded-2xl p-4 -translate-x-2 -translate-y-2 transition duration-200 hover:-translate-y-3 hover:-translate-x-3 hover:bg-[#ffe6c7]'
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

      <section className='mt-8 w-full relative max-w-6xl overflow-hidden border-[4px] border-black bg-[#fefefe] px-6 py-8 text-center shadow-[8px_8px_0_#0b0b0d]'>
        <div className='pointer-events-none z-0   border-5 opacity-70 border-[#272928] -top-20 -right-20 sm:-top-10 sm:-right-15 transition-all bg-[#ff9f66] rounded-full h-48 w-48 rotate-45 absolute'></div>
         <div className='pointer-events-none   border-5 opacity-70 border-[#272928] -bottom-10 -left-20 sm:-bottom-10 sm:-right-15 bg-[#2fff2f] rounded-full h-48 w-48 rotate-45 absolute'></div>
          <div className='z-10 relative'>
            <h2 className='text-3xl sm:text-[44px] leading-tight font-black uppercase tracking-[0.3em] text-[#0b0b0d]'>Your Daily Streak</h2>
        <p className='mt-3 text-base font-medium text-[#133c1b]'>Hook coming soon — keep your routines consistent.</p>
          </div>
        
      
      </section>
    </div>
  )
}

export default App
