import  { useEffect, useState } from 'react'
import TotalTask from './ui/graph/TotalTask'
import TotalSent from './ui/graph/TotalSent'
import TaskWise from './ui/graph/TaskWise'
import LoadingScreen from './ui/Loading'


interface TotalTaskType {
    notification_type:string,
    taskcount:number
}

interface TotalSentType {
    month:string,
    count:number
}

interface TaskWiseType {
    day:number,
    taskuser_id:number
    taskname:string 
    notification_type:string ,
    sent_count: number,
    completed_count: number
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

function Dashboard() {
    const [totalTask,setTotalTask]= useState<TotalTaskType[]>([])
    const [totalSent,setTotalSent]= useState<TotalSentType[]>([])
    const [taskWise,setTaskWise]= useState<TaskWiseType[]>([])
    const [loading,setLoading] = useState(false)

    async function fetchDashBoardDate(){
        try{
            setLoading(true)
            const response= await fetch(`${API_BASE_URL}/api/dashboard`,{
                method:"GET",
                credentials:'include'
            })
            const result= await response.json()
            const totalTaskResult:TotalTaskType[]= result.totalType
            const totalSentResult:TotalSentType[]= result.totalSent
            const taskWiseResult:TaskWiseType[]= result.taskWise
            setTotalTask(totalTaskResult)
            setTotalSent(totalSentResult)
            setTaskWise(taskWiseResult)
        }catch(error){
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchDashBoardDate()
    },[])

    if (loading) return <LoadingScreen/>

    return (
    <div className='w-full max-w-7xl mx-auto px-4 py-12 space-y-12'>

        <div className='relative border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[8px_8px_0_#1a1a1a] overflow-hidden'>
            <div className='h-[7px] bg-[#c8624a] border-b-[3px] border-[#1a1a1a]' />
            <div className='px-8 py-8 flex items-end justify-between gap-6'>
                <div className='space-y-2'>
                    <span className='inline-flex items-center gap-2 border-[3px] border-[#1a1a1a] bg-[#f0d08a] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_#1a1a1a]'>
                        <span style={{color:'#c8624a'}}>●</span> Live Overview
                    </span>
                    <h1
                        className='text-[56px] sm:text-[72px] font-black uppercase leading-[0.88] text-[#1a1a1a]'
                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}
                    >
                        Dashboard<br />Analytics
                    </h1>
                </div>
                <p className='hidden sm:block text-[11px] font-black uppercase tracking-[0.25em] text-[#1a1a1a]/40 text-right leading-relaxed'>
                    Notification<br />Hub
                </p>
            </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <TotalTask totalTask={totalTask}/>
            <TotalSent totalSent={totalSent} />
        </div>

        <div className='relative border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[8px_8px_0_#1a1a1a] overflow-hidden'>
            <div className='h-[7px] bg-[#4a7c9e] border-b-[3px] border-[#1a1a1a]' />
            <div className='px-6 sm:px-10 py-8'>
                <div className='mb-10 space-y-2'>
                    <span className='inline-flex items-center gap-2 border-[3px] border-[#1a1a1a] bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_#1a1a1a]'>
                        ◆ Per-Task Breakdown
                    </span>
                    <h2
                        className='text-[40px] sm:text-[52px] font-black uppercase leading-[0.9] text-[#1a1a1a]'
                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}
                    >
                        Individual Task<br />Statistics
                    </h2>
                    <p className='text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40'>
                        Current Month · Sent vs Completed
                    </p>
                </div>
                <TaskWise taskWise={taskWise}/>
            </div>
        </div>

        <footer className='text-center pb-4'>
            <p className='text-[9px] font-black uppercase tracking-[0.45em] text-[#1a1a1a]/20'>
                Notification Hub · {new Date().getFullYear()} · Brutalist by design
            </p>
        </footer>

    </div>
  )
}

export default Dashboard