import { Check, RefreshCcw, AlertCircle } from 'lucide-react'
import  { useEffect, useRef, useState } from 'react'
import TimezoneSelect from "react-timezone-select"
import { AnimatePresence, motion } from 'framer-motion'
import CustomNotification from '../CustomNotification'

type UserTask={
    taskid:number
    isactive:string
    timezone:string
    notify_after:string
    taskname:string
    fixed_notify_time:string
    notification_type:string
    createdat:string
    taskpriority:string

}

type Type1= {
    taskid:number
    isactive:string
    timezone:string
    notify_after:string
    taskname:string
    notification_type:string
    createdat:string
    taskpriority:string
}

type Type2= {
    taskid:number
    isactive:string
    timezone:string
    notify_after:string
    taskname:string
    notification_type:string
    fixed_notify_time:string
    createdat:string
    taskpriority:string
}

type Type3= {
    taskid:number
    isactive:string
    timezone:string
    notify_after:string
    taskname:string
    notification_type:string
    fixed_notify_time:string
    fixed_notify_date:string
    createdat:string
    taskpriority:string
}








type UpdateProps={
    userid:string
}

// const COMMON_INTERVALS = [
//   { label: '5 minutes', value: '5 minutes' },
//   { label: '15 minutes', value: '15 minutes' },
//   { label: '30 minutes', value: '30 minutes' },
//   { label: '1 hour', value: '1 hour' },
//   { label: '2 hours', value: '2 hours' },
//   { label: '6 hours', value: '6 hours' },
//   { label: '12 hours', value: '12 hours' },
//   { label: '1 day', value: '1 day' },
// ]

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

// const validateNotifyAfter = (value: string): {isValid: boolean; error?: string} => {
//   if (!value.trim()) return { isValid: false, error: 'Notify After is required' }
//   const pattern = /^\d+\s+(minute|hour|day)s?$/i
//   if (!pattern.test(value.trim())) {
//     return { 
//       isValid: false, 
//       error: 'Format: "5 minutes", "1 hour", "2 days"' 
//     }
//   }
//   return { isValid: true }
// }

function Update({userid}:UpdateProps) {
    
   
    const [refreshingTasks, setRefreshingTasks] = useState(false)
    const [statusCards, setStatusCards] = useState<{id:number; text:string; variant:'success'|'error'}[]>([])
    const [customNotificationset,setCustomNotification]= useState(false)
    const [custom1,setCustom1]= useState<Type1[]>([])
     const [custom2,setCustom2]= useState<Type2[]>([])
      const [custom3,setCustom3]= useState<Type3[]>([])
       const [default1,setDefault1]= useState<Type1[]>([])
       const [default2,setDefault2]= useState<Type2[]>([])
       const [default3,setDefault3]= useState<Type3[]>([])

    const messageIdRef = useRef(0)
    const timeoutsRef = useRef<number[]>([])

    

    const showStatusCard = (text: string, variant: 'success' | 'error' = 'success') => {
      const id = messageIdRef.current++
      setStatusCards(prev => [...prev, { id, text, variant }])
      const timeoutId = window.setTimeout(() => {
        setStatusCards(prev => prev.filter(card => card.id !== id))
      }, 2000)
      timeoutsRef.current.push(timeoutId)
    }

  

    async function fetchUsertask(){
      if(!userid) return
      setRefreshingTasks(true)
      try{
        const base = API_BASE_URL ? `${API_BASE_URL}` : ''
        const response = await fetch(`${base}/api/updateget/${userid}` ,{
          method:'GET',
          headers:{
            'Content-Type':'application/json'
          },
          credentials:"include"
        })
        const result = await response.json()
        if(!response.ok){
          throw new Error(result.message)
        }

        const allTask= result.data
       
        const Custom_Tasks_Type1= allTask.filter((item:UserTask)=>(item.notification_type==='first'&& item.taskpriority==='usercreated'))
        const Custom_Tasks_Type2= allTask.filter((item:UserTask)=>(item.notification_type==='second' && item.taskpriority==='usercreated'))
        const Custom_Tasks_Type3= allTask.filter((item:UserTask)=>(item.notification_type==='third' && item.taskpriority==='usercreated'))

        const Defaul_Tasks_Type1=allTask.filter((item:UserTask)=>(item.notification_type==='first'&& item.taskpriority==='default'))
        const Defaul_Tasks_Type2=allTask.filter((item:UserTask)=>(item.notification_type==='second'&& item.taskpriority==='default'))
        const Defaul_Tasks_Type3=allTask.filter((item:UserTask)=>(item.notification_type==='third'&& item.taskpriority==='default'))

          setCustom1(Custom_Tasks_Type1)
          setCustom2(Custom_Tasks_Type2)
          setCustom3(Custom_Tasks_Type3)

          setDefault1(Defaul_Tasks_Type1)
          setDefault2(Defaul_Tasks_Type2)
          setDefault3(Defaul_Tasks_Type3)
          
        console.log("Task1:" ,Custom_Tasks_Type1)
        console.log("Task2:" ,Custom_Tasks_Type2)
        console.log("Task3:" ,Custom_Tasks_Type3)
        console.log("Task1:" ,Defaul_Tasks_Type1)
        console.log("Task2:" ,Defaul_Tasks_Type2)
        console.log("Task3:" ,Defaul_Tasks_Type3)
        
      }catch(error){
        console.log(error)
        showStatusCard('Failed to load tasks error')
      }finally{
        setRefreshingTasks(false)
      }
    }

    

    useEffect(()=>{
      if (customNotificationset) {
        // Disable body scroll
        document.body.style.overflow = 'hidden'
      } else {
        // Re-enable body scroll
        document.body.style.overflow = ''
      }

      return () => {
        document.body.style.overflow = ''
      }
    },[customNotificationset])

   

 



    // async function updateUserTask(taskid: number) {
    //   const task = taskForms[taskid]
    //   if (!task) return null

    //   try{
    //     if(!userid) return null

    //     const base = API_BASE_URL ? `${API_BASE_URL}` : ''
    //     const response = await fetch(`${base}/api/updateput/${userid}` ,{
    //       method:'PUT',
    //       headers:{
    //         'Content-Type':'application/json'
    //       },
    //       credentials:"include",
    //       body: JSON.stringify({
    //         fixed_notify_time: task.fixed_notify_time,
    //         isactive: task.isactive,
    //         taskname: task.taskname,
    //         timezone: task.timezone,
    //         notify_after: task.notifyAfterValue,
    //         taskid: task.taskid
    //       })
    //     })

    //     const result = await response.json()
    //     console.log(result)
    //     if(!response.ok){
    //       throw new Error(result.message)
    //     }
    //     return result
    //   }catch(error){
    //     console.log(error)
    //     throw error
    //   }
    // }

   


   return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-10">
      
      
      {customNotificationset && (
        <>
          
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={() => setCustomNotification(false)}
          />
          
          <div 
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            onClick={() => setCustomNotification(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <CustomNotification setCustomNotification={setCustomNotification}/>
            </div>
          </div>
        </>
      )}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>

          {statusCards.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ type: 'spring', stiffness: 250, damping: 24 }}
              className={`pointer-events-auto border-[4px] border-black rounded-2xl px-5 py-3 shadow-[10px_10px_0_#0b0b0d] text-sm font-black uppercase tracking-wider flex gap-2 items-center ${
                card.variant === 'success'
                  ? 'bg-[#c1ff72] text-[#0b0b0d]'
                  : 'bg-[#ffb5bd] text-[#0b0b0d]'
              }`}
            >
              {card.variant === 'error' && <AlertCircle size={16} />}
              {card.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="relative mb-12 overflow-hidden rounded-[32px] border-[4px] border-black bg-[#fefefe] px-6 py-8 shadow-[12px_12px_0_#0b0b0d]">
        <div className="pointer-events-none absolute -top-10 -right-6 h-32 w-32 rotate-[12deg] border-[4px] border-black bg-[#7df9ff] opacity-60" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rotate-6 border-[4px] border-black bg-[#ff9f66] opacity-70" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]">
                Update Center
              </p>
              <div className="relative ml-2 h-10 w-10 group">
                <button
                  type="button"
                  disabled={refreshingTasks}
                  onClick={fetchUsertask}
                  className="absolute inset-0 z-10 flex h-full w-full items-center justify-center border-[3px] border-black bg-[#2fff2f] shadow-[6px_6px_0_#0b0b0d] transition-colors group-hover:bg-[#08a036]"
                >
                  {refreshingTasks ? (
                    <svg
                      className="h-4 w-4 animate-spin text-black"
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
                  ) : (
                    <RefreshCcw size={16} />
                  )}
                </button>
              
                <span className="absolute inset-0 bg-[#7df9ff] transition duration-200 group-hover:-translate-x-3 group-hover:-translate-y-3" />
                <span className="absolute inset-0 bg-[#ff9f66] transition duration-200 group-hover:translate-x-5 group-hover:translate-y-5" />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-black uppercase leading-tight text-[#0b0b0d] sm:text-[44px]">
              Update Your Notifications
            </h1>
              <button 
                className='mt-3 cursor-pointer border-[3px] border-black bg-[#c1ff72] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1' 
                onClick={()=>setCustomNotification((prev)=>!prev)}
              >
                + Custom Notification
              </button>
            
            <p className="mt-2 max-w-xl text-base font-medium text-[#333]">
              Fine tune intervals, timezones, and cadence rules to match your daily flow.
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      
    </div>
  )

}

export default Update



//  {isLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg
//                         className="h-5 w-5 animate-spin text-black"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                         />
//                       </svg>
//                       Processing...
//                     </span>
//                   ) : (
//                     'Confirm'
//                   )}