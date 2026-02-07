import React from 'react'
import { GitFork  } from 'lucide-react';
import Login from '../Login';

function Navbar() {
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
      <div>
        <Login/>
      </div>
      <div className='ml-auto'>
        <button className='bg-black rounded-md'>
            <span className=' bg-[#ffff00] block  px-2 py-1 -translate-x-1  -translate-y-1  border-black border-2 rounded-md text-sm hover:-translate-y-2 hover:-translate-x-2 
    active:translate-x-0 active:translate-y-0 transition-all'>
               <div className='flex flex-row justify-center items-center'><GitFork strokeWidth={1.5}/> <p className='font-semibold'>Fork</p></div> 
            </span>
        </button>
      </div>
      </div>
    </nav>
  )
}

export default Navbar