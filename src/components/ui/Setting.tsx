import { useEffect, useState } from "react"
import LoadingScreen from "./Loading"
import { Clock, User, Mail, AlertCircle, Edit2, X, Check } from 'lucide-react'

interface UserInfoType {
    fname:string,
    lname:string,
    readonly email:string,
    createdat:string,
    online:string,
    offline:string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

function Setting() {
    const [userinfo,setUserInfo]= useState<UserInfoType>()
    const [infoLoading,setInfoLoading]= useState(false)
    const [loading,setLoading]= useState(false)
    const [message,setMessage]= useState("")
    const [edit,setEdit] = useState(false)

    async function getUserInfo(){
        try{
            setInfoLoading(true)
            const response= await fetch(`${API_BASE_URL}/api/getsetting`,{
                method:"GET",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            
            })

            const result= await response.json()
            if(!response.ok){
               return setMessage(result.message)
            }
            setUserInfo(result.data)
        }catch(error){
            console.log(error)
        }finally{
            setInfoLoading(false)
        }
    }

    async function putUserInfo(){
        try{
            const response= await fetch(`${API_BASE_URL}/api/putsetting`,{
                method:'PUT',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(userinfo)
            })

            const result= await response.json()
            if(!response.ok){
                setEdit(true)
               return setMessage(result.message)
            }

            setUserInfo(result.data)
            setEdit(false)
        }catch(error){
            console.log(error)

            
        }finally{
            setLoading(false)
           
        }
    }

    useEffect(()=>{
        getUserInfo()
    },[])

    useEffect(()=>{

    },[userinfo])

    function handleChange(e:React.ChangeEvent<HTMLInputElement>,type: "fname"|"lname" | "online" | "offline"){
        const value= e.target.value
        if(!userinfo) return

        setUserInfo({
            ...userinfo,
            [type]:value
        })
       
      
        
    }

    function handleSave(){
        
        setLoading(true)
        putUserInfo()

    }
           
    if(infoLoading) return <LoadingScreen/>
    if(!userinfo) return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <div className='flex items-center justify-center gap-2 text-[#1a1a1a]/60 text-sm'>
          <AlertCircle size={16} />
          <span>No Data currently available</span>
        </div>
      </div>
    )

  return (
    <div className='w-full max-w-2xl mx-auto px-4 py-12'>
      {/* Header with Edit Button */}
      <div className='flex items-center justify-between gap-6 mb-10'>
        <div>
          <h1 className='text-5xl sm:text-6xl font-black uppercase text-[#1a1a1a]' style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>Settings</h1>
        </div>
        {!edit && (
          <button 
            disabled={loading}
            onClick={()=>setEdit((prev)=>!prev)}
            className='
              group flex items-center gap-2
              border-[3px] border-[#1a1a1a] bg-[#4a7c9e]
              px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white
              shadow-[6px_6px_0_#1a1a1a]
              transition-all duration-150
              hover:shadow-[3px_3px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]
              active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
              disabled:opacity-40 disabled:cursor-not-allowed
              whitespace-nowrap
            '
          >
            <Edit2 size={16} />
            <span className='hidden sm:block'>Edit</span>
          </button>
        )}
        {edit && (
          <button 
            disabled={loading}
            onClick={()=>{setEdit(false); setMessage("")}}
            className='
              group flex items-center gap-2
              border-[3px] border-[#1a1a1a] bg-[#f2ece0]
              px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]
              shadow-[6px_6px_0_#1a1a1a]
              transition-all duration-150
              hover:shadow-[3px_3px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]
              active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
              disabled:opacity-40 disabled:cursor-not-allowed
              whitespace-nowrap
            '
          >
            <X size={16} />
            <span className='hidden sm:block'>Cancel</span>
          </button>
        )}
      </div>

      {/* Error/Message Display */}
      {message && (
        <div className='mb-8 border-[3px] border-[#c8624a] bg-[#f0d5cf] px-6 py-4 flex items-start gap-3 shadow-[6px_6px_0_#1a1a1a]'>
          <AlertCircle size={20} className='text-[#c8624a] flex-shrink-0 mt-0.5' />
          <p className='text-[13px] font-bold text-[#1a1a1a]'>{message}</p>
        </div>
      )}

      {/* Form Container */}
      <div className='space-y-6'>
        {/* Basic Info Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-black uppercase text-[#1a1a1a] tracking-widest'>Account Information</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* First Name */}
            <div className='relative border-[3px] border-[#1a1a1a] bg-white shadow-[6px_6px_0_#1a1a1a] overflow-hidden'>
              <label className='flex items-center gap-2 px-5 py-3 border-b-[3px] border-[#1a1a1a] bg-[#f9edca] text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]'>
                <User size={14} />
                First Name
              </label>
              <input 
                type="text" 
                value={userinfo?.fname} 
                disabled={!edit || loading} 
                onChange={(e)=>handleChange(e,"fname")}
                className='w-full px-5 py-4 text-[14px] font-medium text-[#1a1a1a] bg-white disabled:bg-[#f2ece0] disabled:text-[#1a1a1a]/60 focus:outline-none focus:ring-0'
              />
            </div>

            {/* Last Name */}
            <div className='relative border-[3px] border-[#1a1a1a] bg-white shadow-[6px_6px_0_#1a1a1a] overflow-hidden'>
              <label className='flex items-center gap-2 px-5 py-3 border-b-[3px] border-[#1a1a1a] bg-[#f9edca] text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]'>
                <User size={14} />
                Last Name
              </label>
              <input 
                type="text" 
                value={userinfo?.lname} 
                disabled={!edit || loading} 
                onChange={(e)=>handleChange(e,"lname")}
                className='w-full px-5 py-4 text-[14px] font-medium text-[#1a1a1a] bg-white disabled:bg-[#f2ece0] disabled:text-[#1a1a1a]/60 focus:outline-none focus:ring-0'
              />
            </div>
          </div>

          {/* Email Field (Read-only) */}
          <div className='relative border-[3px] border-[#1a1a1a] bg-white shadow-[6px_6px_0_#1a1a1a] overflow-hidden'>
            <label className='flex items-center gap-2 px-5 py-3 border-b-[3px] border-[#1a1a1a] bg-[#c8dcea] text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]'>
              <Mail size={14} />
              Email Address
            </label>
            <input 
              type="email" 
              value={userinfo?.email} 
              disabled={true}
              className='w-full px-5 py-4 text-[14px] font-medium text-[#1a1a1a] bg-[#f2ece0] text-[#1a1a1a]/60 focus:outline-none focus:ring-0 cursor-not-allowed'
            />
          </div>
        </div>

        {/* Quiet Hours Section */}
        <div className='relative border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[8px_8px_0_#1a1a1a] overflow-hidden'>
          <div className='h-[7px] bg-[#4a7c9e] border-b-[3px] border-[#1a1a1a]' />
          <div className='px-8 py-8'>
            <div className='space-y-2 mb-8'>
              <span className='inline-flex items-center gap-2 border-[3px] border-[#1a1a1a] bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_#1a1a1a]'>
                <Clock size={12} /> Quiet Hours
              </span>
              <h2 className='text-[32px] font-black uppercase leading-[0.9] text-[#1a1a1a]' style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}>
                Notification<br />Silence Window
              </h2>
              <p className='text-[13px] font-bold text-[#1a1a1a]/70 pt-2'>The frequently occurring notifications will stop during this time period</p>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {/* Online Time */}
              <div className='relative border-[3px] border-[#1a1a1a] bg-white shadow-[6px_6px_0_#1a1a1a] overflow-hidden'>
                <label className='flex items-center gap-2 px-5 py-3 border-b-[3px] border-[#1a1a1a] bg-[#f0d5cf] text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]'>
                  <Clock size={14} />
                  Start Time
                </label>
                <input 
                  type="time" 
                  value={userinfo?.online} 
                  disabled={!edit || loading} 
                  onChange={(e)=>handleChange(e,"online")}
                  className='w-full px-5 py-4 text-[14px] font-medium text-[#1a1a1a] bg-white disabled:bg-[#f2ece0] disabled:text-[#1a1a1a]/60 focus:outline-none focus:ring-0'
                />
              </div>

              {/* Offline Time */}
              <div className='relative border-[3px] border-[#1a1a1a] bg-white shadow-[6px_6px_0_#1a1a1a] overflow-hidden'>
                <label className='flex items-center gap-2 px-5 py-3 border-b-[3px] border-[#1a1a1a] bg-[#f0d5cf] text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]'>
                  <Clock size={14} />
                  End Time
                </label>
                <input 
                  type="time" 
                  value={userinfo?.offline} 
                  disabled={!edit || loading} 
                  onChange={(e)=>handleChange(e,"offline")}
                  className='w-full px-5 py-4 text-[14px] font-medium text-[#1a1a1a] bg-white disabled:bg-[#f2ece0] disabled:text-[#1a1a1a]/60 focus:outline-none focus:ring-0'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        {edit && (
          <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t-[3px] border-[#1a1a1a]'>
            <button 
              disabled={loading} 
              onClick={()=>handleSave()}
              className='
                flex-1 group flex items-center justify-center gap-2
                border-[3px] border-[#1a1a1a] bg-[#c8624a]
                px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white
                shadow-[6px_6px_0_#1a1a1a]
                transition-all duration-150
                hover:shadow-[3px_3px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]
                active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
                disabled:opacity-40 disabled:cursor-not-allowed
              '
            >
              <Check size={18} />
              <span>{loading ? 'Saving…' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Setting