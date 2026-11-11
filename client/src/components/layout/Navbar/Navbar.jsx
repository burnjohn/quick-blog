import React from 'react'
import { assets } from '../../../assets/assets'
import { useAppContext } from '../../../context/AppContext'
import { ROUTES } from '../../../constants/routes'

function Navbar() {
  const { navigate, token } = useAppContext()

  return (
    <>
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:text-ink'
      >
        Skip to content
      </a>

      <header className='sticky top-0 z-40 border-b border-ink bg-paper/90 backdrop-blur-md'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8'>
          <button
            type='button'
            onClick={() => navigate(ROUTES.HOME)}
            aria-label='QuickBlog — go to home'
            className='group flex min-h-11 items-center gap-3 cursor-pointer'
          >
            <img
              src={assets.logo_mark}
              alt='logo'
              className='h-9 w-9 transition-transform duration-300 group-hover:-rotate-6 sm:h-10 sm:w-10'
            />
            <span className='font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]'>
              QuickBlog<span className='text-ink-muted'>.</span>
            </span>
          </button>

          <div className='flex items-center gap-6'>
            <span className='hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted md:inline'>
              Stories · Ideas · Notes
            </span>
            <button
              type='button'
              onClick={() => navigate(ROUTES.ADMIN)}
              className='group inline-flex min-h-11 items-center gap-3 border border-ink bg-ink px-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-paper transition-colors duration-200 cursor-pointer hover:bg-signal hover:text-ink'
            >
              {token ? 'Dashboard' : 'Login'}
              <span aria-hidden='true' className='transition-transform duration-200 group-hover:translate-x-1'>→</span>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
