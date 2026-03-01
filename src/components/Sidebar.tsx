import { useEffect, useState } from 'react'
import './socket.js'
import socket from './socket.ts'

function Sidebar() {
    const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
    const [activity,setActivity]= useState()
    async function fetchTaskActivity(){
        try{
            const response= await fetch(`${API_BASE_URL}/api/taskactivity`,{
                method:'GET',
                credentials:'include',

            })
            const result= await response.json()
            setActivity(result.data)
            console.log(result)
        }catch(error){
            console.log(error)
        }
    }

    socket.on('',()=>{
        fetchTaskActivity();
    })

    useEffect(()=>{
        console.log(activity)
    },[activity])

  return (
    <div className='flex justify-center items-center'>
        <div className='mt-10 overflow-y-scroll'>
            Main
        </div>
    </div>
  )
}

export default Sidebar