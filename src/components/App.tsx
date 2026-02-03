import React,{useEffect, useState} from 'react'
import { Outlet } from 'react-router-dom'


type UserInfoRow= {
  taskname:string
  taskdescription:string
  fixed_notify_time:string
  timezone:string 
  notify_after: string
}

function App() {
  const [userid,setUserId]= useState<string>('f06c9a03-5acd-4c32-a062-128563fc8f71')
  const [userinfo,setUserInfo]=useState<UserInfoRow[]>([])

  async function fetchUserinfo(){
    try{
      if(!userid) return
      const response= await fetch(`http://localhost:3000/api/userinfo/${userid}`,{
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
    <div className='mt-4 w-full justify-center items-center max-w-7xl flex  flex-col sm:border-r-[3px] sm:border-l-[3px]  '>
      <div className='bg-[#7df9ff] flex flex-col justify-center items-center w-full px-5 py-5 border-b-5  '>
      <h1 className='font-bold text-md md:text-lg'>Notification Subscription</h1>

        <div className=' '>
          {userinfo && (userinfo.map((data)=>(
              <div className=' bg-black p-2 mt-2' key={data.taskname}>
                <span className='bg-white block'><h3>{data.taskname}</h3>
                <p>{data.taskdescription}</p>
                <p>{data.fixed_notify_time}</p>
                <p>{data.notify_after}</p>
                 <p>{data.timezone}</p>
                 </span>
              </div>
          )))}
        </div>
      
      </div>
      <div className='bg-[#2fff2f] w-full flex justify-center items-center px-5 py-5 border-b-5 '>
      <h1 className='font-bold text-md md:text-lg'>Your Streaks</h1>
      </div>

    </div>
  )
}

export default App
