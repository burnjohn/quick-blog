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

      <NavLink to={ROUTES.ADMIN_ADD_BLOG} className={navLinkClass}>
        <img src={assets.add_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Add blogs</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_LIST_BLOG} className={navLinkClass}>
        <img src={assets.list_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Blog lists</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_COMMENTS} className={navLinkClass}>
        <img src={assets.comment_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Comments</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_ANALYTICS} className={navLinkClass}>
        <svg
          className='min-w-4 w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
          />
        </svg>
        <p className='hidden md:inline-block'>Analytics</p>
      </NavLink>
    </nav>
  )
}

export default Sidebar
