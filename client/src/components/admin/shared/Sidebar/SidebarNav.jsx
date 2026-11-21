import React from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../../utils/helpers'
import { SLIDE_TRANSITION } from '../motion'
import { NAV_ITEMS } from './navItems'

const LABEL_MOTION = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { ...SLIDE_TRANSITION, delay: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.12 } }
}

const linkClass = ({ isActive }) => classNames(
  'group relative flex min-h-12 items-center gap-4 px-7 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-200',
  isActive ? 'text-ink' : 'text-paper/75 hover:bg-paper/10 hover:text-paper'
)

// Admin nav links. The signal block behind the active link slides between
// items (shared layoutId). `indicatorId` must differ per mounted instance.
function SidebarNav({ collapsed = false, indicatorId, onNavigate }) {
  return (
    <ul className='flex flex-col gap-1'>
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={linkClass}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={indicatorId}
                    aria-hidden='true'
                    transition={SLIDE_TRANSITION}
                    className='absolute inset-0 bg-signal'
                  />
                )}
                <motion.img
                  layout='position'
                  src={item.icon}
                  alt=''
                  className={classNames(
                    'relative w-5 min-w-5',
                    !isActive && 'brightness-0 invert opacity-75 group-hover:opacity-100'
                  )}
                />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span key='label' layout='position' {...LABEL_MOTION} className='relative whitespace-nowrap'>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default SidebarNav
