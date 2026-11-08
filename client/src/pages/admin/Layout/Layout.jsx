import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../../components/admin'
import { useAppContext } from '../../../context/AppContext'
import { ThemeToggle, Logo } from '../../../components/ui'
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
    <>
      <header className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-border bg-card'>
        <button
          type='button'
          onClick={() => navigate(ROUTES.HOME)}
          aria-label='QuickBlog home'
          className='cursor-pointer rounded-md hover:opacity-80 transition-opacity duration-200'
        >
          <Logo className='w-32 sm:w-40' />
        </button>
        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className='text-sm font-medium px-6 sm:px-8 py-2.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:opacity-90 transition-opacity duration-200'
          >
            Logout
          </button>
        </div>
      </header>
      <div className='flex h-[calc(100vh-70px)] bg-background text-foreground'>
        <Sidebar />
        <div className='flex-1 overflow-auto h-full'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
