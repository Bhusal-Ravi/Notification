import React, { useEffect, useState } from 'react'
import { data } from 'react-router-dom'
import TimezoneSelect, { type ITimezone } from "react-timezone-select"

type UserTask={
    taskid:number
    isactive:string
    timezone:string
    notify_after:string
    taskname:string
    fixed_notify_time:number
}
type UpdateProps={
    userid:string
}


const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
function Update({userid}:UpdateProps) {
    const [userTask,setUserTask]= useState<UserTask[]>([])
    let task1= userTask?.filter(data=> data.taskid===1)[0]
    let task2= userTask?.filter(data=> data.taskid===2)[0]
    let task3= userTask?.filter(data=> data.taskid===3)[0]
    let task5= userTask?.filter(data=> data.taskid===5)[0]
    let task6= userTask?.filter(data=> data.taskid===6)[0]

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

      console.log(result.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchUsertask()
    },[])

  return (
    <div>
        {task1&&<div>
            <h1>{task1.taskname}</h1>
            <p>#TaskId {task1.taskid}</p>
            <select name='isactive' onChange={(e)=>task1.isactive=e.target.value}>
                <option value='true' selected={task1.isactive==="true"}>True</option>
                <option value='false' selected={task1.isactive==="false"}>False</option>
            </select>
            <TimezoneSelect value={task1.timezone}  />




        </div>}

        {task2&&<div>

        </div>}

        {task3&&<div>

        </div>}

        {task5&&<div>

        </div>}

        {task6&&<div>

        </div>}
    </div>
  )
}

export default Update