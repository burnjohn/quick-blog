import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { SLIDE_TRANSITION } from '../motion'
import SidebarNav from './SidebarNav'

const FOCUSABLE = 'a[href], button:not([disabled])'

const OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

const PANEL_MOTION = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: SLIDE_TRANSITION },
  exit: { x: '-100%', transition: { ...SLIDE_TRANSITION, duration: 0.25 } }
}

// Keyboard handling while the drawer is open: Escape closes, Tab stays inside.
function useDrawerKeyboard(isOpen, panelRef, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined
    const previousFocus = document.activeElement
    panelRef.current?.querySelector(FOCUSABLE)?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll(FOCUSABLE)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [isOpen, panelRef, onClose])
}

// Off-canvas admin navigation for small screens.
function MobileNavDrawer({ isOpen, onClose }) {
  const panelRef = useRef(null)
  useDrawerKeyboard(isOpen, panelRef, onClose)

  return (
    <AnimatePresence>
      {isOpen && (
        <div key='drawer' className='fixed inset-0 z-50 md:hidden'>
          <motion.div {...OVERLAY_MOTION} onClick={onClose} aria-hidden='true' className='absolute inset-0 bg-ink/60' />
          <motion.div
            {...PANEL_MOTION}
            ref={panelRef}
            id='admin-drawer'
            role='dialog'
            aria-modal='true'
            aria-label='Admin menu'
            className='absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink pt-5 shadow-hard-signal'
          >
            <div className='mb-4 flex items-center justify-between px-7'>
              <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60'>Menu</p>
              <button
                type='button'
                onClick={onClose}
                aria-label='Close menu'
                className='flex h-11 w-11 cursor-pointer items-center justify-center border border-paper/30 text-paper transition-colors hover:bg-signal hover:text-ink'
              >
                <span aria-hidden='true'>✕</span>
              </button>
            </div>
            <nav aria-label='Admin'>
              <SidebarNav indicatorId='drawer-active' onNavigate={onClose} />
            </nav>
            <div aria-hidden='true' className='halftone-signal mt-auto h-24 opacity-40 [mask-image:linear-gradient(transparent,#000)]' />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MobileNavDrawer
