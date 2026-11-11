import React from 'react'
import { Outlet } from 'react-router-dom'
import { assets } from '../../../assets/assets'
import { Sidebar } from '../../../components/admin'
import { useAppContext } from '../../../context/AppContext'
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
    <div className='bg-paper text-ink'>
      <header className='flex h-[70px] items-center justify-between border-b border-paper/15 bg-ink px-4 text-paper sm:px-8'>
        <button
          type='button'
          onClick={() => navigate(ROUTES.HOME)}
          aria-label='QuickBlog — go to home'
          className='group flex min-h-11 items-center gap-3 cursor-pointer'
        >
          <img src={assets.logo_mark} alt='' className='h-9 w-9 transition-transform duration-300 group-hover:-rotate-6' />
          <span className='font-serif text-2xl font-semibold'>QuickBlog<span className='text-signal'>.</span></span>
          <span className='hidden border border-paper/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70 sm:inline'>
            Admin
          </span>
        </button>
        <button
          type='button'
          onClick={handleLogout}
          className='min-h-11 border border-paper/40 px-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-paper cursor-pointer transition-colors hover:border-danger hover:bg-danger'
        >
          Logout
        </button>
      </header>
      <div className='flex h-[calc(100dvh-70px)]'>
        <Sidebar />
        <main className='h-full flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
