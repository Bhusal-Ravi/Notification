import { useEffect, useState } from 'react'
import './socket.js'
import socket from './socket.ts'
import { AnimatePresence, motion } from "motion/react"

type ActivityType={
    performed_at:string,
    event_type:string,
    taskname:string
}

interface NavbarProps {

  clearSidebar:boolean
}

function Sidebar({clearSidebar}:NavbarProps) {
    const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
    const [activity,setActivity]= useState<ActivityType[]>([])
    async function fetchTaskActivity(){
        try{
            const response= await fetch(`${API_BASE_URL}/api/taskactivity?limit=10&skip=20`,{
                method:'GET',
                credentials:'include',
            })
            const result= await response.json()
            setActivity(result.data)
        }catch(error){
            console.log(error)
        }
    }

    function manageDate(value:string){
        const now= new Date(value)
        const time= now.toLocaleTimeString()
        const date= now.toLocaleDateString()
        return {time:time,date:date}
    }

    useEffect(()=>{
        socket.on("activity:new",(data)=>{
            const now= new Date()
            setActivity((prev)=>[{event_type:data.event_type, taskname:data.taskname, performed_at:now.toString()},...prev])
        })
        return () => { socket.off("activity:new") }
    },[])

    useEffect(()=>{
        fetchTaskActivity()
    },[])

    useEffect(()=>{
        if(clearSidebar){
            setActivity([])
        }
    },[clearSidebar])

  return (
    <motion.div
        initial={{opacity:0,x:"-100%"}}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: false }}
        className='flex fixed z-50 top-[64px] left-0 w-[320px] overflow-y-auto items-start bg-[#f5f0e8] border-r-[3px] border-black'
        style={{ height: 'calc(100vh - 64px)' }}
    >
        <div className='w-full flex flex-col'>

            {/* Header */}
            <div className='border-b-[3px] border-black p-4'>
                <div className='inline-flex items-center gap-2 bg-black px-3 py-1 mb-3 shadow-[2px_2px_0px_#166534]'>
                    <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse'/>
                    <span className='text-green-400 text-[10px] font-bold tracking-widest'>LIVE STREAM</span>
                </div>
                <h1 className='text-3xl font-black uppercase tracking-tight leading-none text-black'>
                    ACTIVITY<br/>LOGS
                </h1>
                <p className='text-xs text-gray-500 mt-1 tracking-wider'>Real-time task events</p>
            </div>

            {/* Stats row */}
            <div className='grid grid-cols-2 border-b-[3px] border-black'>
                <div className='p-3 border-r-[2px] border-black'>
                    <p className='text-[9px] tracking-widest text-gray-500 uppercase'>Total Events</p>
                    <p className='text-2xl font-black text-black'>{String(activity?.length).padStart(2,'0')}</p>
                </div>
                <div className='p-3'>
                    <p className='text-[9px] tracking-widest text-gray-500 uppercase'>Status</p>
                    <p className='text-sm font-black text-green-700'>ACTIVE</p>
                </div>
            </div>

            {/* Activity list */}
            <div className='p-3 flex flex-col gap-3'>
                <AnimatePresence>
                    {activity?.length>0 ? ( activity.map((item) => (
                        <motion.div
                            key={item.performed_at}
                            initial={{ opacity: 0, y: -20, x: -100 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, y: -20, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className='bg-white border-[2px] border-black shadow-[3px_3px_0px_#000] p-3'
                        >
                            {/* Top row */}
                            <div className='flex justify-between items-center mb-2'>
                                <span className='text-[9px] tracking-widest text-gray-400 uppercase'>Task</span>
                                <span className='text-[9px] font-bold bg-black text-[#f5f0e8] px-2 py-0.5 tracking-wider'>
                                    #{item?.taskname?.slice(0,4).toUpperCase()}
                                </span>
                            </div>

                            {/* Task name */}
                            <p className='text-sm font-black uppercase tracking-tight text-black mb-2'>
                                {item?.taskname}
                            </p>

                            {/* Event type */}
                            <div className={`inline-block  border-[1.5px] ${item?.event_type==='completed'?"border-green-700 bg-green-50":"bg-blue-50 border-blue-700"}  px-2 py-0.5 mb-3`}>
                                <span className={` ${item?.event_type==='completed'?"text-green-700":"text-blue-700"} text-[10px] font-bold  tracking-wider`}>
                                    {item?.event_type==='sent'?"SYSTEM ".concat(item?.event_type?.toUpperCase()):"USER ".concat(item?.event_type?.toUpperCase())}
                                </span>
                            </div>

                            {/* Time chips */}
                            <div className='flex gap-2 border-t-[1.5px] border-gray-200 pt-2'>
                                <span className='text-[10px] font-bold border-[1.5px] border-black px-2 py-0.5'>
                                    {manageDate(item.performed_at).time}
                                </span>
                                <span className='text-[10px] font-bold border-[1.5px] border-black px-2 py-0.5'>
                                    {manageDate(item.performed_at).date}
                                </span>
                            </div>
                        </motion.div>
                    ))):(<div><p>No logs available currently</p><br/>
                                <p>Make sure you are logged in</p>
                    </div>)}
                </AnimatePresence>
            </div>

        </div>
    </motion.div>
  )
}

export default Sidebar