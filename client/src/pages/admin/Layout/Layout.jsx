import React, { useCallback, useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { assets } from '../../../assets/assets'
import { Sidebar, MobileNavDrawer, getNavLabel } from '../../../components/admin'
import { pageMotion, SLIDE_TRANSITION } from '../../../components/admin/shared/motion'
import { useAppContext } from '../../../context/AppContext'
import { ROUTES } from '../../../constants/routes'
import { MESSAGES } from '../../../constants/messages'
import toast from 'react-hot-toast'

const SIDEBAR_STORAGE_KEY = 'admin.sidebarCollapsed'

const readCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const todayLabel = () => new Date().toLocaleDateString('en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
})

function Layout() {
  const { setToken, navigate } = useAppContext()
  const location = useLocation()
  const outlet = useOutlet()
  const mainRef = useRef(null)
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const pageLabel = getNavLabel(location.pathname)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate(ROUTES.HOME)
    toast.success(MESSAGES.SUCCESS_LOGOUT)
  }

  const handleToggleSidebar = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
    } catch {
      // Storage unavailable (private mode): keep the in-memory state only.
    }
  }

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  return (
    <div className='bg-paper text-ink'>
      <header className='flex h-[70px] items-center justify-between gap-3 border-b border-paper/15 bg-ink px-4 text-paper sm:px-8'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setIsDrawerOpen(true)}
            aria-label='Open menu'
            aria-expanded={isDrawerOpen}
            aria-controls='admin-drawer'
            className='flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 border border-paper/30 transition-colors hover:bg-signal hover:text-ink md:hidden'
          >
            <span aria-hidden='true' className='h-0.5 w-5 bg-current' />
            <span aria-hidden='true' className='h-0.5 w-5 bg-current' />
            <span aria-hidden='true' className='h-0.5 w-3.5 self-center bg-current' />
          </button>
          <button
            type='button'
            onClick={() => navigate(ROUTES.HOME)}
            aria-label='QuickBlog — go to home'
            className='group flex min-h-11 cursor-pointer items-center gap-3'
          >
            <img src={assets.logo_mark} alt='' className='h-9 w-9 transition-transform duration-300 group-hover:-rotate-6' />
            <span className='font-serif text-2xl font-semibold'>QuickBlog<span className='text-signal'>.</span></span>
            <span className='hidden border border-paper/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70 sm:inline'>
              Admin
            </span>
          </button>
        </div>
        <p className='hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60 lg:block'>
          Editor&apos;s desk · {todayLabel()}
        </p>
        <button
          type='button'
          onClick={handleLogout}
          className='min-h-11 cursor-pointer border border-paper/40 px-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:border-danger hover:bg-danger'
        >
          Logout
        </button>
      </header>

      <div className='flex h-[calc(100dvh-70px)]'>
        <Sidebar collapsed={collapsed} onToggle={handleToggleSidebar} />
        <motion.main
          ref={mainRef}
          layout='position'
          layoutScroll
          transition={SLIDE_TRANSITION}
          className='h-full min-w-0 flex-1 overflow-auto'
        >
          <AnimatePresence mode='wait' initial={false} onExitComplete={() => mainRef.current?.scrollTo(0, 0)}>
            <motion.div key={location.pathname} {...pageMotion} className='min-h-full'>
              {outlet}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>

      <MobileNavDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      <p className='sr-only' aria-live='polite'>
        {pageLabel ? `${pageLabel} page` : ''}
      </p>
    </div>
  )
}

export default Layout
