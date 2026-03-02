import { Outlet } from 'react-router-dom'
import Navbar from './ui/Navbar'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'


function Layout() {
    const [sidebar,setSidebar] = useState<boolean>(false)
    const [clearSidebar,setClearSidebar]= useState<boolean>(false)
    useEffect(()=>{
      if(sidebar===true){
        document.body.style.overflow='hidden'
      }
       return () => {
      document.body.style.overflow = 'unset'; 
    };
    },[sidebar])
  return (
    <div>
      <Navbar clearSidebar={clearSidebar} setClearSidebar={setClearSidebar} sidebar={sidebar} setSidebar={setSidebar} />
     
     
      <main className="pt-16 relative flex justify-center items-center">
         
    <div style={{ display: sidebar ? 'block' : 'none' }}>
           <Sidebar clearSidebar={clearSidebar}/>
         </div>
      
        <Outlet />
      </main>
    </div>
  )
}

export default Layout