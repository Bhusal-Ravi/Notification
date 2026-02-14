import  { useEffect, useState } from 'react'
import { GitFork  } from 'lucide-react';
import Login from '../Login';
import { authClient } from '../../../lib/auth-client';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

type Data= {
  userid:string
  createdat:string,
  fname:string,
  lname:string,
  email:string

}


function Navbar() {

     const [data,setData]= useState<Data>()
     const [showLogout, setShowLogout] = useState(false)
     const [imgError, setImgError] = useState(false)
    const { data: session } = authClient.useSession()
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

    <nav className="fixed px-10 py-5 justify-center     top-0 border-b-3 md:border-b-4 border-t-red-500 z-20 flex  w-full items-center bg-white ">
      <div className='md:max-w-7xl  w-full flex justify-center items-center'>
      <div className='mr-auto'>
         <button className='bg-black rounded-md'>
            <span className=' bg-[#ffff00] block  px-2 py-1 -translate-x-1  -translate-y-1  border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2
    active:translate-x-0 active:translate-y-0 transition-all'>
               <p className='font-bold text-xl'>N</p>
            </span>
        </button>
      </div>
      <div className='ml-auto flex flex-row justify-center items-center'>
       <button className='bg-black rounded-md mr-2'>
            <span className=' bg-[#ffff00] block  px-2 py-1 -translate-x-1  -translate-y-1  border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 
    active:translate-x-0 active:translate-y-0 transition-all'>
               <div className='flex flex-row justify-center items-center'><GitFork strokeWidth={1.5}/> <p className='font-semibold'>Fork</p></div> 
            </span>
        </button>
      { !session ?   (
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
       <p>{data?.fname} {data?.lname}</p> 
      </span>
      {showLogout && (
        <div className='absolute top-full left-0 w-full mt-2 z-50'>
          <div className='bg-black rounded-md'>
            <button
              onClick={async () => {
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
      </div>
    </nav>
  )
}

export default Navbar