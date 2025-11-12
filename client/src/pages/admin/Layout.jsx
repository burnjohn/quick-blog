import React from 'react'
import { Outlet } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { Sidebar } from '../../components/admin'
import { useAppContext } from '../../context/AppContext'
import { Button } from '../../components/ui'
import { ROUTES } from '../../constants/routes'
import { MESSAGES } from '../../constants/messages'
import toast from 'react-hot-toast'

function Layout() {
  const { setToken, navigate } = useAppContext()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate(ROUTES.HOME)
    toast.success(MESSAGES.SUCCESS_LOGOUT)
  }

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200 bg-white'>
        <img 
          src={assets.logo} 
          alt='logo' 
          className='w-32 sm:w-40 cursor-pointer hover:opacity-80 transition-opacity' 
          onClick={() => navigate(ROUTES.HOME)}
        />
        <button 
          onClick={handleLogout}
          className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors'
        >
          Logout
        </button>
      </div>
      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <div className='flex-1 overflow-auto h-full'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
