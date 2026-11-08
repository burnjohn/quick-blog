import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../../../assets/assets'
import { ROUTES } from '../../../../constants/routes'
import { classNames } from '../../../../utils/helpers'

function Sidebar() {
  const navLinkClass = ({ isActive }) => classNames(
    'flex items-center gap-3 mx-2 md:mx-3 my-0.5 py-3 px-3 md:px-5 md:min-w-56 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200',
    isActive
      ? 'bg-accent-soft text-accent'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  )

  return (
    <nav className='flex flex-col border-r border-border bg-card min-h-full pt-6'>
      <NavLink end to={ROUTES.ADMIN_DASHBOARD} className={navLinkClass}>
        <img src={assets.home_icon} alt='' className='min-w-4 w-5 dark:invert' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_ADD_BLOG} className={navLinkClass}>
        <img src={assets.add_icon} alt='' className='min-w-4 w-5 dark:invert' />
        <p className='hidden md:inline-block'>Add blogs</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_LIST_BLOG} className={navLinkClass}>
        <img src={assets.list_icon} alt='' className='min-w-4 w-5 dark:invert' />
        <p className='hidden md:inline-block'>Blog lists</p>
      </NavLink>

      <NavLink to={ROUTES.ADMIN_COMMENTS} className={navLinkClass}>
        <img src={assets.comment_icon} alt='' className='min-w-4 w-5 dark:invert' />
        <p className='hidden md:inline-block'>Comments</p>
      </NavLink>
    </nav>
  )
}

export default Sidebar
