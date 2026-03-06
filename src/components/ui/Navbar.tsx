import  { useEffect, useState } from 'react'
import { GitFork, LayoutDashboard, Sidebar, Menu, Settings, X, Home } from 'lucide-react';
import Login from '../Login';
import { authClient } from '../../../lib/auth-client';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';


const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

type Data= {
  userid:string
  createdat:string,
  fname:string,
  lname:string,
  email:string

}

interface NavbarProps {
  sidebar: boolean;
  setSidebar: (value: boolean) => void;
  setClearSidebar:(value:boolean)=>void
  clearSidebar:boolean
}

function Navbar({ sidebar, setSidebar,setClearSidebar,clearSidebar }: NavbarProps) {

     const [data,setData]= useState<Data>()
     const [showLogout, setShowLogout] = useState(false)
     const [showMobileMenu, setShowMobileMenu] = useState(false)
     const [imgError, setImgError] = useState(false)
     const [hoveredButton, setHoveredButton] = useState<string | null>(null)
    const { data: session,isPending } = authClient.useSession()
    const navigate = useNavigate()

   

   async function getUser(email:string){
    try{
        
        const base = API_BASE_URL ? `${API_BASE_URL}` : ''
        const response= await fetch(`${base}/api/userexist`,{
          method:'POST',
          credentials:'include',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({email})
        })
        const result= await response.json()

        
        if(!response.ok){
         return 
        }

        setData(result.data)
       


        
      }catch(error){
        console.log(error)
      }
   }

   

   useEffect(()=>{
    if(!session) return
    getUser(session.user.email)
   },[session])
  return (

    <nav className="fixed px-4 md:px-10 py-4 md:py-5 justify-center top-0 border-b-3 md:border-b-4 border-t-red-500 z-20 flex w-full items-center bg-white">
     
      <div className='md:max-w-7xl w-full flex justify-between md:justify-center items-center gap-4'>
      
      {/* Left Section - Sidebar and Logo */}
      <div className='flex flex-row justify-center items-center gap-3 md:gap-5'>

        {/* Sidebar button with Activity Logs tooltip */}
        <div
          className='bg-black rounded-md relative'
          onMouseEnter={() => setHoveredButton('sidebar')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {session && (
            <button
              onClick={() => setSidebar(!sidebar)}
              className='bg-[#ffff00] flex items-center justify-center px-2 py-1 -translate-x-1 -translate-y-1 border-black border-2 rounded-md hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer'
            >
              <Sidebar strokeWidth={1.5} size={22}/>
            </button>
          )}
          {hoveredButton === 'sidebar' && session && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[#ffff00] text-xs font-semibold rounded whitespace-nowrap border-[2px] border-black'>
              Activity Logs
            </div>
          )}
        </div>

        {/* Desktop: N Logo — navigates to '/' */}
        <div className='relative hidden md:block'>
          <button onClick={() => navigate('/')} className='bg-black rounded-md'>
            <span className='bg-[#ffff00] flex items-center justify-center px-3 md:px-4 py-2 md:py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
              <p className='font-bold text-lg md:text-xl m-0'>N</p>
            </span>
          </button>
        </div>

        {/* Mobile: Circular N button — navigates to '/' */}
        <button onClick={() => navigate('/')} className='bg-black rounded-full md:hidden'>
          <span className='bg-[#ffff00] flex items-center justify-center w-10 h-10 -translate-x-1 -translate-y-1 border-black border-2 rounded-full text-sm hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
            <p className='font-bold text-lg'>N</p>
          </span>
        </button>



      </div>

      {/* Right Section - Desktop Menu */}
      <div className='hidden md:flex flex-row justify-center items-center gap-2 md:gap-4 ml-auto'>
       
       <div className='relative'>
         <button className='bg-black rounded-md' onMouseEnter={() => setHoveredButton('fork')} onMouseLeave={() => setHoveredButton(null)}>
              <span className='bg-[#ffff00] flex items-center justify-center px-3 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                 <a href='https://github.com/Bhusal-Ravi/Notification' target="_blank" className='flex items-center justify-center'><GitFork strokeWidth={1.5} size={18}/></a> 
              </span>
          </button>
          {hoveredButton === 'fork' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[#ffff00] text-xs font-semibold rounded whitespace-nowrap border-[2px] border-black'>
              Fork
            </div>
          )}
       </div>

       <div className='relative' onMouseEnter={() => setHoveredButton('home')} onMouseLeave={() => setHoveredButton(null)}>
         <button onClick={() => navigate('/main')} className='bg-black rounded-md'>
              <span className='bg-[#ffff00] flex items-center justify-center px-3 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                 <Home strokeWidth={1.5} size={18}/>
              </span>
          </button>
          {hoveredButton === 'home' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[#ffff00] text-xs font-semibold rounded whitespace-nowrap border-[2px] border-black'>
              Home
            </div>
          )}
       </div>

     {(!isPending && session) && (
       <div className='relative'>
         <button onClick={()=>navigate('/dashboard')} className='bg-black rounded-md' onMouseEnter={() => setHoveredButton('dashboard')} onMouseLeave={() => setHoveredButton(null)}>
              <span className='bg-[#ffff00] flex items-center justify-center px-3 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                 <LayoutDashboard strokeWidth={1.5} size={18}/>
              </span>
          </button>
          {hoveredButton === 'dashboard' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[#ffff00] text-xs font-semibold rounded whitespace-nowrap border-[2px] border-black'>
              Dashboard
            </div>
          )}
       </div>
     )} 

      {(!isPending && session) && (
        <div className='relative'>
          <button onClick={()=>navigate('/settings')} className='bg-black rounded-md' onMouseEnter={() => setHoveredButton('settings')} onMouseLeave={() => setHoveredButton(null)}>
               <span className='bg-[#ffff00] flex items-center justify-center px-3 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
                  <Settings strokeWidth={1.5} size={18}/>
               </span>
           </button>
           {hoveredButton === 'settings' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[#ffff00] text-xs font-semibold rounded whitespace-nowrap border-[2px] border-black'>
              Settings
            </div>
          )}
        </div>
      )} 

      {isPending? (<span className=' border-[3px] border-black text-black text-lg flex items-center justify-center px-3 py-2 font-black'>
           Loading
         </span>): !session ?   (
    <Login/>
  )
  :(
    <div className='relative bg-black rounded-md'>
       
      <span onClick={() => setShowLogout(prev => !prev)} className='bg-[#ffff00] cursor-pointer flex justify-center items-center px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
       {session?.user?.image && !imgError ? (
         <img className='rounded-full border-[3px] border-black h-[30px] w-[30px] mr-3' src={session?.user?.image} onError={() => setImgError(true)} />
       ) : (
         <span className='rounded-full border-[3px] border-black h-[30px] w-[30px] mr-3 bg-black flex items-center justify-center text-white text-xs font-black'>
           {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase()}
         </span>
       )}
       <p className='text-sm'>{data?.fname} {data?.lname}</p> 
      </span>
      {showLogout && (
        <div className='absolute top-full left-0 w-full mt-2 z-50'>
          <div className='bg-black rounded-md'>
            <button
              onClick={async () => {
                setSidebar(false)
                socket.off("activity:new")
                setClearSidebar(!clearSidebar)
                await authClient.signOut()
                setShowLogout(false)
                navigate('/')
              }}
              className='bg-[#ffb5bd] w-full block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md text-sm font-bold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>)
}
      </div>

      {/* Mobile: Hamburger Menu Button */}
      <div className='md:hidden relative'>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className='bg-black rounded-md'
        >
          <span className='bg-[#ffff00] flex items-center justify-center p-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-md hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all'>
            {showMobileMenu ? <X strokeWidth={1.5} size={22} /> : <Menu strokeWidth={1.5} size={22} />}
          </span>
        </button>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className='absolute top-full right-0 mt-2 z-50'>
            <div className='bg-black rounded-md shadow-lg'>
              <button 
                onClick={() => {
                  window.open('https://github.com/Bhusal-Ravi/Notification', '_blank')
                  setShowMobileMenu(false)
                }}
                className='bg-[#ffff00] w-full block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-t-md text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              >
                <GitFork strokeWidth={1.5} size={18}/> Fork
              </button>

              <button
                onClick={() => {
                  navigate('/main')
                  setShowMobileMenu(false)
                }}
                className='bg-[#ffff00] w-full block px-4 py-2 -translate-x-1 -translate-y-1 border-l-black border-r-black border-t-black border-2 text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              >
                <Home strokeWidth={1.5} size={18}/> Home
              </button>

              {(!isPending && session) &&(<button 
                onClick={() => {
                  navigate('/dashboard')
                  setShowMobileMenu(false)
                }}
                className='bg-[#ffff00] w-full block px-4 py-2 -translate-x-1 -translate-y-1 border-l-black border-r-black border-t-black border-2 text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              >
                <LayoutDashboard strokeWidth={1.5} size={18}/> Dashboard
              </button>
)}

              {(!isPending && session) &&(<button 
                onClick={() => setShowMobileMenu(false)}
                className='bg-[#ffff00] w-full block px-4 py-2 -translate-x-1 -translate-y-1 border-l-black border-r-black border-t-black border-2 text-sm font-semibold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap'
              >
                <Settings strokeWidth={1.5} size={18}/> Settings
              </button>
              )}

              {session && (
                <button
                  onClick={async () => {
                    setSidebar(false)
                    socket.off("activity:new")
                    setClearSidebar(!clearSidebar)
                    await authClient.signOut()
                    setShowMobileMenu(false)
                    navigate('/')
                  }}
                  className='bg-[#ffb5bd] w-full block px-4 py-2 -translate-x-1 -translate-y-1 border-black border-2 rounded-b-md text-sm font-bold hover:-translate-y-2 hover:-translate-x-2 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer'
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </nav>
  )
}

export default Navbar