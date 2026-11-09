import React from 'react'
import { assets } from '../../../assets/assets'
import { useAppContext } from '../../../context/AppContext'
import { ROUTES } from '../../../constants/routes'

function Navbar() {
  const { navigate, token } = useAppContext()

  return (
    <header className='fixed inset-x-0 top-4 z-40 px-4 sm:px-8'>
      <nav
        aria-label='Main'
        className='mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-void/50 py-2 pl-5 pr-2 backdrop-blur-xl'
      >
        <img
          onClick={() => navigate(ROUTES.HOME)}
          src={assets.logo}
          alt='logo'
          className='w-28 cursor-pointer brightness-0 invert transition-opacity hover:opacity-80 sm:w-36'
        />
        <button
          onClick={() => navigate(ROUTES.ADMIN)}
          className='group flex cursor-pointer items-center gap-2 rounded-full bg-lime px-5 py-2 text-sm font-medium text-void shadow-glow-lime transition hover:brightness-110'
        >
          {token ? 'Dashboard' : 'Login'}
          <img
            src={assets.arrow}
            className='w-3 transition-transform duration-300 group-hover:translate-x-0.5'
            alt='arrow'
          />
        </button>
      </nav>
    </header>
  )
}

export default Navbar
