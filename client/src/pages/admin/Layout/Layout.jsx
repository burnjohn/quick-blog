import React from 'react'
import { Outlet } from 'react-router-dom'
import { assets } from '../../../assets/assets'
import { Sidebar } from '../../../components/admin'
import { useAppContext } from '../../../context/AppContext'
import { Button } from '../../../components/ui'
import { ROUTES } from '../../../constants/routes'
import { MESSAGES } from '../../../constants/messages'
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
    <div className='flex h-screen flex-col'>
      <header className='flex h-[70px] shrink-0 items-center justify-between border-b border-white/10 bg-surface/60 px-4 backdrop-blur-xl sm:px-12'>
        <img
          src={assets.logo}
          alt='logo'
          className='w-32 cursor-pointer brightness-0 invert transition-opacity hover:opacity-80 sm:w-40'
          onClick={() => navigate(ROUTES.HOME)}
        />
        <Button variant='secondary' size='sm' onClick={handleLogout}>
          Logout
        </Button>
      </header>
      <div className='flex min-h-0 flex-1'>
        <Sidebar />
        <main className='h-full min-w-0 flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
