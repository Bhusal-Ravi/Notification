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
}

type TaskFormState = UserTask & {
  notifyAfterValue: string
  notifyAfterValidation: {isValid: boolean; error?: string}
}

type UpdateProps={
    userid:string
}

const COMMON_INTERVALS = [
  { label: '5 minutes', value: '5 minutes' },
  { label: '15 minutes', value: '15 minutes' },
  { label: '30 minutes', value: '30 minutes' },
  { label: '1 hour', value: '1 hour' },
  { label: '2 hours', value: '2 hours' },
  { label: '6 hours', value: '6 hours' },
  { label: '12 hours', value: '12 hours' },
  { label: '1 day', value: '1 day' },
]

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const validateNotifyAfter = (value: string): {isValid: boolean; error?: string} => {
  if (!value.trim()) return { isValid: false, error: 'Notify After is required' }
  const pattern = /^\d+\s+(minute|hour|day)s?$/i
  if (!pattern.test(value.trim())) {
    return { 
      isValid: false, 
      error: 'Format: "5 minutes", "1 hour", "2 days"' 
    }
  }
  return { isValid: true }
}

function Update({userid}:UpdateProps) {
    const [taskForms, setTaskForms] = useState<Record<number, TaskFormState>>({})
    const [loadingTasks, setLoadingTasks] = useState<Record<number, boolean>>({})
    const [refreshingTasks, setRefreshingTasks] = useState(false)
    const [statusCards, setStatusCards] = useState<{id:number; text:string; variant:'success'|'error'}[]>([])
    const [customNotificationset,setCustomNotification]= useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<number, { notifyAfter?: boolean; fixedTime?: boolean; timezone?: boolean }>>({})
  const [submitAttempts, setSubmitAttempts] = useState<Record<number, boolean>>({})
    const messageIdRef = useRef(0)
    const timeoutsRef = useRef<number[]>([])

    const requiresNotifyAfter = (task: UserTask) =>
      task.taskname !== 'Mid Night Report' && task.taskname !== 'Quote of the Day'

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

        const formStates: Record<number, TaskFormState> = {}
        result.data.forEach((task: UserTask) => {
          const hasNotifyAfter = Boolean(task.notify_after?.trim())

          formStates[task.taskid] = {
            ...task,
            notifyAfterValue: task.notify_after,
            notifyAfterValidation: requiresNotifyAfter(task) && hasNotifyAfter
              ? validateNotifyAfter(task.notify_after)
              : { isValid: true }
          }
        })
        setTaskForms(formStates)
        console.log(result.data)
      }catch(error){
        console.log(error)
        showStatusCard('Failed to load tasks error')
      }finally{
        setRefreshingTasks(false)
      }
    }

    useEffect(()=>{
      fetchUsertask()
      return () => {
        timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId))
        timeoutsRef.current = []
      }
    },[userid])

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

    const updateTaskField = (taskid: number, field: string, value: any) => {
      setTaskForms(prev => ({
        ...prev,
        [taskid]: { ...prev[taskid], [field]: value }
      }))
    }

    const markTouched = (taskid: number, field: 'notifyAfter' | 'fixedTime' | 'timezone') => {
      setTouchedFields(prev => ({
        ...prev,
        [taskid]: { ...prev[taskid], [field]: true }
      }))
    }

    const updateNotifyAfter = (taskid: number, value: string) => {
      markTouched(taskid, 'notifyAfter')
      const validation = value === 'custom' 
        ? { isValid: false, error: 'Enter custom format' }
        : validateNotifyAfter(value)

      setTaskForms(prev => ({
        ...prev,
        [taskid]: {
          ...prev[taskid],
          notifyAfterValue: value === 'custom' ? '' : value,
          notifyAfterValidation: validation
        }
      }))
    }

    const handleCustomNotifyAfter = (taskid: number, value: string) => {
      markTouched(taskid, 'notifyAfter')
      const validation = validateNotifyAfter(value)
      setTaskForms(prev => ({
        ...prev,
        [taskid]: {
          ...prev[taskid],
          notifyAfterValue: value,
          notifyAfterValidation: validation
        }
      }))
    }

    async function updateUserTask(taskid: number) {
      const task = taskForms[taskid]
      if (!task) return null

      try{
        if(!userid) return null

        const base = API_BASE_URL ? `${API_BASE_URL}` : ''
        const response = await fetch(`${base}/api/updateput/${userid}` ,{
          method:'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          credentials:"include",
          body: JSON.stringify({
            fixed_notify_time: task.fixed_notify_time,
            isactive: task.isactive,
            taskname: task.taskname,
            timezone: task.timezone,
            notify_after: task.notifyAfterValue,
            taskid: task.taskid
          })
        })

        const result = await response.json()
        console.log(result)
        if(!response.ok){
          throw new Error(result.message)
        }
        return result
      }catch(error){
        console.log(error)
        throw error
      }
    }

    async function handleConfirm(taskid: number){
      const task = taskForms[taskid]
      if(!task) return

      setSubmitAttempts(prev => ({ ...prev, [taskid]: true }))

      // Validate all required fields
      const errors: string[] = []

      if (!task.notifyAfterValidation.isValid && requiresNotifyAfter(task)) {
        errors.push(`Notify After: ${task.notifyAfterValidation.error}`)
      }
      if (!task.fixed_notify_time) {
        errors.push('Fixed Time is required')
      }
      if (!task.timezone) {
        errors.push('Timezone is required')
      }

      if (errors.length > 0) {
        errors.forEach((error, idx) => {
          setTimeout(() => {
            showStatusCard(error, 'error')
          }, idx * 200)
        })
        return
      }

      setLoadingTasks(prev=>({...prev,[taskid]:true}))
      try{
        const response = await updateUserTask(taskid)
        const message = typeof response?.message === 'string' && response.message.length > 0
          ? response.message
          : 'Successfully updated your task'
        showStatusCard(message, 'success')
      }catch(error){
        const message = error instanceof Error ? error.message : 'Failed to update task'
        showStatusCard(message, 'error')
      }finally{
        setLoadingTasks(prev=>{
          const next={...prev}
          delete next[taskid]
          return next
        })
      }
    }


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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(taskForms)?.map(task => {
          const needsNotifyAfter = requiresNotifyAfter(task)
          const isValidated = task.notifyAfterValidation.isValid
          const isLoading = Boolean(loadingTasks[task.taskid])
          const touched = touchedFields[task.taskid] || {}
          const hasSubmitAttempt = Boolean(submitAttempts[task.taskid])
          const showNotifyValidation = needsNotifyAfter && (touched.notifyAfter || hasSubmitAttempt)
          const showFixedTimeError = !task.fixed_notify_time && (touched.fixedTime || hasSubmitAttempt)
          const showTimezoneError = !task.timezone && (touched.timezone || hasSubmitAttempt)
          const hasErrors = (!task.fixed_notify_time || !task.timezone) || (needsNotifyAfter && !isValidated)
          const buttonDisabled = isLoading || hasErrors

          return (
            <div key={task.taskid} className="bg-black rounded-2xl">
              <div className="relative h-full w-full -translate-x-2 -translate-y-2 border-[4px] border-black rounded-2xl bg-white p-5 shadow-[8px_8px_0_#000]">

                {/* Header */}
                <div className="flex items-start  justify-between">
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

                {/* Active Toggle */}
                <div className="mt-4 flex items-center justify-between border-[3px] border-black bg-[#f7f7f7] px-3 py-2 shadow-[4px_4px_0_#000]">
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Active
                  </span>
                  <select
                    value={String(task.isactive)}
                    className="border-[3px] border-black bg-[#ffff00] px-2 py-1 font-bold shadow-[4px_4px_0_#000] cursor-pointer"
                    onChange={(e) => updateTaskField(task.taskid, 'isactive', e.target.value)}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* Notify After - Fixed or Editable */}
                {task.taskname === 'Mid Night Report' || task.taskname === 'Quote of the Day' ? (
                  <div className="mt-4 rounded-2xl border-[3px] border-black bg-[#fff9ef] px-4 py-3 shadow-[4px_4px_0_#000]">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#666]">Notify After</p>
                    <p className="mt-1 text-xl font-black text-[#0b0b0d]">
                      {task.taskname === 'Mid Night Report' ? '1 day (fixed)' : 'Daily at 6 AM'}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest">
                      Notify After
                    </p>

                    <div className="space-y-2">
                      <select
                        value={task.notifyAfterValue}
                        className={`w-full border-[3px] border-black px-3 py-2 font-medium shadow-[4px_4px_0_#000] cursor-pointer ${
                          task.notifyAfterValue === 'custom' ? 'bg-[#fff9ef]' : 'bg-white'
                        }`}
                        onChange={(e) => updateNotifyAfter(task.taskid, e.target.value)}
                      >
                        <option value="">Select interval...</option>
                        {COMMON_INTERVALS.map(interval => (
                          <option key={interval.value} value={interval.value}>
                            {interval.label}
                          </option>
                        ))}
                      </select>

                      {task.notifyAfterValue === 'custom' && (
                        <input
                          type="text"
                          placeholder="e.g. 5 minutes, 2 hours, 1 day"
                          className={`w-full border-[3px] border-black px-3 py-2 font-medium shadow-[4px_4px_0_#000]`}
                          value={task.notifyAfterValue}
                          onChange={(e) => handleCustomNotifyAfter(task.taskid, e.target.value)}
                        />
                      )}

                      {/* Validation Status */}
                      {showNotifyValidation && (
                        <div className={`flex items-start gap-2 text-xs font-semibold px-2 py-1 rounded ${
                          task.notifyAfterValidation.isValid
                            ? 'text-[#0b7236] bg-[#d0f4d7]'
                            : 'text-[#7d0b0b] bg-[#f4d0d0]'
                        }`}>
                          {task.notifyAfterValidation.isValid ? (
                            <Check size={14} className="flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                          )}
                          <span>{task.notifyAfterValidation.isValid ? 'Valid format' : task.notifyAfterValidation.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fixed Time */}
                <div className="mt-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest">
                    Fixed Time
                  </p>
                  <input
                    type="time"
                    disabled={task.taskname === 'Mid Night Report' || task.taskname === 'Quote of the Day'}
                    value={task.fixed_notify_time}
                    className={`w-full border-[3px] border-black px-3 py-2 font-semibold shadow-[4px_4px_0_#000]
                      ${task.taskname === 'Mid Night Report' || task.taskname === 'Quote of the Day' 
                        ? 'bg-[#e5e5e5] cursor-not-allowed' 
                        : 'bg-white'}`}
                    onChange={(e) => updateTaskField(task.taskid, 'fixed_notify_time', e.target.value)}
                  />
                  {showFixedTimeError && (
                    <p className="text-xs text-[#7d0b0b] mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Required
                    </p>
                  )}
                </div>

                {/* Timezone */}
                <div className="mt-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest">
                    Timezone
                  </p>
                  <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_#000]">
                    <TimezoneSelect
                      value={task.timezone}
                      onChange={(e) => {
                        markTouched(task.taskid, 'timezone')
                        updateTaskField(task.taskid, 'timezone', e.value)
                      }}
                    />
                  </div>
                  {showTimezoneError && (
                    <p className="text-xs text-[#7d0b0b] mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Required
                    </p>
                  )}
                </div>

                {/* Confirm Button */}
                <button
                  onClick={() => handleConfirm(task.taskid)}
                  disabled={buttonDisabled}
                  aria-disabled={buttonDisabled}
                  className={`mt-6 w-full border-[4px] border-black px-4 py-3 text-lg font-black uppercase transition-transform ${
                    buttonDisabled
                      ? 'bg-[#d4d4d4] cursor-not-allowed opacity-70'
                      : 'bg-[#ffff00] shadow-[6px_6px_0_#000] hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin text-black"
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
                      Processing...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

}

export default Update