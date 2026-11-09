import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../../../assets/assets'
import { ROUTES } from '../../../../constants/routes'
import { classNames } from '../../../../utils/helpers'

function Sidebar() {
  const navLinkClass = ({ isActive }) => classNames(
    'relative flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-colors hover:bg-white/5 hover:text-ink',
    isActive
      ? 'bg-white/[0.06] text-primary before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-primary'
      : 'text-muted'
  )

  return (
    <nav className='flex min-h-full shrink-0 flex-col border-r border-white/10 bg-surface/40 pt-6 backdrop-blur-xl'>
      <NavLink end to={ROUTES.ADMIN_DASHBOARD} className={navLinkClass}>
        <img src={assets.home_icon} alt='' className='min-w-4 w-5 invert opacity-80' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_ADD_BLOG} className={navLinkClass}>
        <img src={assets.add_icon} alt='' className='min-w-4 w-5 invert opacity-80' />
        <p className='hidden md:inline-block'>Add blogs</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_LIST_BLOG} className={navLinkClass}>
        <img src={assets.list_icon} alt='' className='min-w-4 w-5 invert opacity-80' />
        <p className='hidden md:inline-block'>Blog lists</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_COMMENTS} className={navLinkClass}>
        <img src={assets.comment_icon} alt='' className='min-w-4 w-5 invert opacity-80' />
        <p className='hidden md:inline-block'>Comments</p>
      </NavLink>
    </nav>
  )
}

export default Sidebar
