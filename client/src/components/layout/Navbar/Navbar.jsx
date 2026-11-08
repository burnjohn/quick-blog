import React from 'react'
import { assets } from '../../../assets/assets'
import { useAppContext } from '../../../context/AppContext'
import ThemeToggle from '../../ui/ThemeToggle'
import Logo from '../../ui/Logo'
import { ROUTES } from '../../../constants/routes'

function Navbar() {
  const { navigate, token } = useAppContext()

  return (
    <header className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md'>
      <nav className='flex justify-between items-center py-4 px-6 sm:px-16 xl:px-32'>
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
            onClick={() => navigate(ROUTES.ADMIN)}
            className='inline-flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer bg-primary text-primary-foreground px-6 sm:px-8 py-2.5 hover:opacity-90 transition-opacity duration-200'
          >
            {token ? 'Dashboard' : 'Login'}
            <img src={assets.arrow} className='w-3 dark:invert' alt='' aria-hidden='true' />
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
