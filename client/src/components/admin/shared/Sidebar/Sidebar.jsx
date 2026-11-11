import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../../../assets/assets'
import { ROUTES } from '../../../../constants/routes'
import { classNames } from '../../../../utils/helpers'

const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: assets.home_icon, end: true },
  { to: ROUTES.ADMIN_ADD_BLOG, label: 'Add blogs', icon: assets.add_icon },
  { to: ROUTES.ADMIN_LIST_BLOG, label: 'Blog lists', icon: assets.list_icon },
  { to: ROUTES.ADMIN_COMMENTS, label: 'Comments', icon: assets.comment_icon },
]

function Sidebar() {
  const navLinkClass = ({ isActive }) => classNames(
    'group flex min-h-12 items-center gap-3 px-4 font-mono text-xs uppercase tracking-[0.14em] transition-colors md:min-w-60 md:px-6',
    isActive ? 'bg-signal text-ink' : 'text-paper/75 hover:bg-paper/10 hover:text-paper'
  )

  const iconClass = (isActive) => classNames(
    'w-5 min-w-5',
    !isActive && 'brightness-0 invert opacity-75 group-hover:opacity-100'
  )

  return (
    <nav aria-label='Admin' className='flex min-h-full flex-col gap-1 bg-ink pt-6'>
      <p className='mb-3 hidden px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 md:block'>
        Menu
      </p>
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} end={item.end} to={item.to} className={navLinkClass} aria-label={item.label}>
          {({ isActive }) => (
            <>
              <img src={item.icon} alt='' className={iconClass(isActive)} />
              <span className='hidden md:inline'>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default Sidebar
