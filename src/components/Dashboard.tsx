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
            console.log(result)
            const totalTaskResult:TotalTaskType[]= result.totalType
            const totalSentResult:TotalSentType[]= result.totalSent
            const taskWiseResult:TaskWiseType[]= result.taskWise

            setTotalTask(totalTaskResult)
            setTotalSent(totalSentResult)
            setTaskWise(taskWiseResult)
            console.log(taskWise)
           
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchDashBoardDate()
    },[])

    if (loading) return <LoadingScreen/>
    return  (
    <div className='w-full max-w-7xl mx-auto px-4 py-12'>
        <div className='mb-12 border-b-[3px] border-[#1a1a1a] pb-8'>
          <h1 className='text-5xl font-black text-[#1a1a1a] uppercase tracking-tight'>Dashboard Analytics</h1>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
            <TotalTask totalTask={totalTask}/>
            <TotalSent totalSent={totalSent} />
        </div>
        
        <div className="">
            <h1 className="text-xl font-bold">Individual Task Statistics For Current Month</h1>
            <TaskWise taskWise={taskWise}/>
        </div>
        
    </div>
  )
}

export default Dashboard