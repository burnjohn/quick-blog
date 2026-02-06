import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../../assets/assets'
import { ROUTES } from '../../../constants/routes'
import { classNames } from '../../../utils/helpers'

function Sidebar() {
  const navLinkClass = ({ isActive }) => classNames(
    'flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-colors hover:bg-primary/5',
    isActive && 'bg-primary/10 border-r-4 border-primary'
  )

  return (
    <nav className='flex flex-col border-r border-gray-200 min-h-full pt-6'>
      <NavLink end to={ROUTES.ADMIN_DASHBOARD} className={navLinkClass}>
        <img src={assets.home_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_LIST_BLOG} className={navLinkClass}>
        <img src={assets.list_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Blog lists</p>
      </NavLink>
    </nav>
  )
}

export default Sidebar
