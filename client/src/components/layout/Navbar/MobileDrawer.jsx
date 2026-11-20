import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL, getStaggerDelay } from '../../ui/Reveal'
import { NAV_LINKS } from './navLinks'
import { useFocusTrap } from './useFocusTrap'
import { padIndex } from '../../blog/helpers'

const PANEL_TRANSITION = { duration: 0.45, ease: EASE_EDITORIAL }
const EXIT_TRANSITION = { duration: 0.27, ease: EASE_EDITORIAL }

function MobileDrawer({ open, onClose, onAccount, accountLabel, returnFocusRef }) {
  const panelRef = useRef(null)
  useFocusTrap({ active: open, containerRef: panelRef, returnFocusRef, onEscape: onClose })

  return (
    <AnimatePresence>
      {open && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <motion.div
            aria-hidden='true'
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: PANEL_TRANSITION }}
            exit={{ opacity: 0, transition: EXIT_TRANSITION }}
            className='absolute inset-0 bg-ink/60'
          />
          <motion.div
            ref={panelRef}
            id='mobile-menu'
            role='dialog'
            aria-modal='true'
            aria-label='Site menu'
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: PANEL_TRANSITION }}
            exit={{ x: '100%', transition: EXIT_TRANSITION }}
            className='absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col bg-ink text-paper shadow-[-6px_0_0_0_var(--color-signal)]'
          >
            <div className='flex items-center justify-between border-b border-paper/20 px-5 py-3'>
              <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>In this edition</p>
              <button
                type='button'
                onClick={onClose}
                aria-label='Close menu'
                className='inline-flex h-11 w-11 items-center justify-center border border-paper/40 font-mono text-lg cursor-pointer transition-colors hover:border-signal hover:text-signal'
              >
                <span aria-hidden='true'>✕</span>
              </button>
            </div>

            <nav aria-label='Mobile' className='flex-1 overflow-y-auto px-5 py-6'>
              <ul className='flex flex-col'>
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...PANEL_TRANSITION, delay: 0.1 + getStaggerDelay(index) }}
                    className='border-b border-paper/15'
                  >
                    <a
                      href={link.href}
                      onClick={onClose}
                      className='group flex min-h-16 items-baseline gap-4 py-3 font-serif text-4xl font-semibold tracking-tight transition-colors hover:text-signal'
                    >
                      <span className='font-mono text-[11px] font-normal tracking-[0.18em] text-signal'>{padIndex(index)}</span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className='halftone-signal border-t border-paper/20 p-5'>
              <button
                type='button'
                onClick={onAccount}
                className='inline-flex min-h-12 w-full items-center justify-between border-2 border-signal bg-signal px-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink cursor-pointer transition-colors hover:bg-paper'
              >
                {accountLabel}
                <span aria-hidden='true'>→</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MobileDrawer
