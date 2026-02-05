import { Check } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { data} from 'react-router-dom'
import TimezoneSelect, { type ITimezone } from "react-timezone-select"

type UserTask={
    taskid:number
    isactive:string
    timezone:string
    notify_after:string
    taskname:string
    fixed_notify_time:string
}
type UpdateProps={
    userid:string
}


const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
function Update({userid}:UpdateProps) {
    const [userTask,setUserTask]= useState<UserTask[]>([])
    const [notifyAfter, setNotifyAfter] = useState<{taskid:number; notify_after:string}[]>([])

  

    async function fetchUsertask(){
        try{
            if(!userid) return
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response= await fetch(`${base}/api/updateget/${userid}` ,{
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

    setUserTask(result.data)
    setNotifyAfter(result.data.map(item=>({taskid:item.taskid,notify_after:""})))
      
     
      

      console.log(result.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchUsertask()
    },[])

 function isValidNotifyAfter(value: string) {

  return /^\d+\s+(minute|hour|day)s?$/.test(value.trim())

}

function handleNotifyAfterSubmit(e: React.FormEvent, taskid:number) {
    e.preventDefault()
    const currentValue = notifyAfter.find(item=>item.taskid===taskid)?.notify_after ?? ''

    if (!isValidNotifyAfter(currentValue)) {
        alert("Invalid format. Use: 1 hour, 15 minute, 1 day")
        return
    }

    setUserTask((prev)=>
        prev.map(task=>
            task.taskid===taskid?{...task,notify_after:currentValue}
            :task
        )
    )
}

async function updateUserTask({fixed_notify_time,isactive,taskname,timezone,notify_after}){
    try{

    }catch(error){

    }
}

function handleConfirm(taskid:Number){
 const data=  userTask.filter(item=>item.taskid===taskid)[0]
 let {fixed_notify_time,isactive,taskname,timezone,notify_after}= data
    if(!fixed_notify_time || !isactive || !taskname || !timezone || !notify_after){
        alert("Fill in all the fields to confirm")
    }
console.log(notify_after)
 if(notify_after.days){
    const time=notify_after.days
    notify_after=`${time} days`
 }else if(notify_after.hours){
    const time=notify_after.hours
    notify_after=`${time} hours`
 }else if(notify_after.minutes){
    const time=notify_after.minutes
    notify_after=`${time} minutes`
 }


 updateUserTask({fixed_notify_time,isactive,taskname,timezone,notify_after})


}


   return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="relative mb-12 overflow-hidden rounded-[32px] border-[4px] border-black bg-[#fefefe] px-6 py-8 shadow-[12px_12px_0_#0b0b0d]">
        <div className="pointer-events-none absolute -top-10 -right-6 h-32 w-32 rotate-[12deg] border-[4px] border-black bg-[#7df9ff] opacity-60" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rotate-6 border-[4px] border-black bg-[#ff9f66] opacity-70" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]">
              Control Center
            </p>
            <h1 className="mt-4 text-3xl font-black uppercase leading-tight text-[#0b0b0d] sm:text-[44px]">
              Update Your Notifications
            </h1>
            <p className="mt-2 max-w-xl text-base font-medium text-[#333]">
              Fine tune intervals, timezones, and cadence rules to match your daily flow.
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userTask.map(task => (
          <div key={task.taskid} className="bg-black rounded-2xl">
            <div className="relative -translate-x-2 -translate-y-2 border-[4px] border-black rounded-2xl bg-white p-5 shadow-[8px_8px_0_#000]">

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#555]">
                    Task
                  </p>
                  <h2 className="text-2xl font-black">
                    {task.taskname}
                  </h2>
                </div>

                <span className="border-[3px] border-black bg-white px-3 py-1 text-xs font-bold shadow-[4px_4px_0_#000]">
                  #{task.taskid}
                </span>
              </div>

              {/* Active */}
              <div className="mt-4 flex items-center justify-between border-[3px] border-black bg-[#f7f7f7] px-3 py-2 shadow-[4px_4px_0_#000]">
                <span className="text-sm font-bold uppercase tracking-widest">
                  Active
                </span>

                <select
                  value={String(task.isactive)}
                  className="border-[3px] border-black bg-[#ffff00] px-2 py-1 font-bold shadow-[4px_4px_0_#000]"
                  onChange={(e) =>
                    setUserTask(prev =>
                      prev.map(item =>
                        item.taskid === task.taskid
                          ? { ...item, isactive: e.target.value }
                          : item
                      )
                    )
                  }
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>

              {/* Notify after */}
              {task.taskname === 'Mid Night Report' || task.taskname === 'Quote of the Day' ? (
                <div className="mt-4 rounded-2xl border-[3px] border-black bg-[#fff9ef] px-4 py-3 shadow-[4px_4px_0_#000]">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#666]">Notify After</p>
                  <p className="mt-1 text-xl font-black text-[#0b0b0d]">
                    {task.taskname === 'Mid Night Report' ? '1 day (fixed)' : 'Daily at 6 AM'}
                  </p>
                </div>
              ) : (
              <form
                onSubmit={(e) => handleNotifyAfterSubmit(e, task.taskid)}
                className="mt-4"
              >
                <p className="mb-2 text-xs font-bold uppercase tracking-widest">
                  Notify After
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`w-full border-[3px] border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0_#000]
                      ${task.taskid === 6 || task.taskid === 5 ? 'hidden' : ''}`}
                    value={
                      notifyAfter.find(item => item.taskid === task.taskid)
                        ?.notify_after ?? ''
                    }
                    onChange={(e) =>
                      setNotifyAfter(prev =>
                        prev.map(item =>
                          item.taskid === task.taskid
                            ? { ...item, notify_after: e.target.value }
                            : item
                        )
                      )
                    }
                  />

                  {/* Small check button */}
                  <button
                    type="submit"
                    className="border-[3px] border-black bg-[#ffff00] p-2 shadow-[4px_4px_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </form>
              )}

              {/* Fixed time */}
              <div className="mt-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest">
                  Fixed Time
                </p>

                <input
                  type="time"
                  disabled={task.taskname === 'Mid Night Report' || task.taskname === 'Quote of the Day'}
                  defaultValue={task.taskname === 'Mid Night Report' ? '00:00' : task.taskname === 'Quote of the Day' ? '06:00' : task.fixed_notify_time}
                  className={`w-full border-[3px] border-black px-3 py-2 font-semibold shadow-[4px_4px_0_#000]
                    ${task.taskname === 'Mid Night Report' || task.taskname === 'Quote of the Day' ? 'bg-[#e5e5e5] cursor-not-allowed' : 'bg-white'}`}
                  onChange={(e) =>
                    setUserTask(prev =>
                      prev.map(item =>
                        item.taskid === task.taskid
                          ? { ...item, fixed_notify_time: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </div>

              {/* Timezone */}
              <div className="mt-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest">
                  Timezone
                </p>

                <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_#000]">
                  <TimezoneSelect
                    value={task.timezone}
                    onChange={(e) =>
                      setUserTask(prev =>
                        prev.map(item =>
                          item.taskid === task.taskid
                            ? { ...item, timezone: e.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
              </div>

              {/* Confirm */}
              <button
                onClick={() => handleConfirm(task.taskid)}
                className="mt-6 w-full border-[4px] border-black bg-[#ffff00] px-4 py-3 text-lg font-black uppercase shadow-[6px_6px_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1"
              >
                Confirm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}

export default Update