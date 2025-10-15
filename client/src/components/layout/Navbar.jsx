import React from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import Button from '../ui/Button'
import { ROUTES } from '../../constants/routes'

function Navbar() {
  const { navigate, token } = useAppContext()

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      <img 
        onClick={() => navigate(ROUTES.HOME)} 
        src={assets.logo} 
        alt='logo' 
        className='w-32 sm:w-44 cursor-pointer hover:opacity-80 transition-opacity' 
      />
      <button 
        onClick={() => navigate(ROUTES.ADMIN)}  
        className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5 hover:bg-primary/90 transition-colors'
      >
        {token ? 'Dashboard' : 'Login'}
        <img src={assets.arrow} className='w-3' alt='arrow' />
      </button>
    </div>
  )
}

export default Navbar
