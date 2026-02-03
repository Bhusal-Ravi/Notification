import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './ui/Navbar'

function Layout() {
  return (
    <div>
      <Navbar />
      <main className="pt-16 flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout