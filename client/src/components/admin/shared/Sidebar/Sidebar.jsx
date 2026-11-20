import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../../utils/helpers'
import { SLIDE_TRANSITION } from '../motion'
import SidebarNav from './SidebarNav'

// Desktop ink sidebar. Collapses to an icon rail; the size change is animated
// with a layout (transform) animation, never by tweening width.
function Sidebar({ collapsed, onToggle }) {
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    <motion.aside
      layout
      transition={SLIDE_TRANSITION}
      className={classNames(
        'relative z-10 hidden shrink-0 flex-col overflow-hidden bg-ink pt-6 md:flex',
        collapsed ? 'w-[76px]' : 'w-64'
      )}
    >
      <motion.p
        layout='position'
        aria-hidden='true'
        className='mb-3 px-7 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60'
      >
        {collapsed ? '§' : 'Menu'}
      </motion.p>

      <nav aria-label='Admin'>
        <SidebarNav collapsed={collapsed} indicatorId='sidebar-active' />
      </nav>

      <motion.div layout='position' className='mt-auto border-t border-paper/15'>
        <button
          type='button'
          onClick={onToggle}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          className='flex min-h-14 w-full cursor-pointer items-center gap-4 px-7 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70 transition-colors duration-200 hover:bg-signal hover:text-ink'
        >
          <motion.span
            aria-hidden='true'
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={SLIDE_TRANSITION}
            className='inline-block w-5 text-center text-base leading-none'
          >
            «
          </motion.span>
          {!collapsed && <span className='whitespace-nowrap'>Collapse</span>}
        </button>
      </motion.div>
    </motion.aside>
  )
}

export default Sidebar
