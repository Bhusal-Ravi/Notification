import  { useEffect, useState } from 'react'
import TotalTask from './ui/graph/TotalTask'
import TotalSent from './ui/graph/TotalSent'

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
    async function fetchDashBoardDate(){
        try{
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
        }
    }

    useEffect(()=>{
        fetchDashBoardDate()
    },[])

  return (
    <div className='mt-20'>
        <TotalTask totalTask={totalTask}/>
        <TotalSent totalSent={totalSent} />
    
    </div>
  )
}

export default Dashboard