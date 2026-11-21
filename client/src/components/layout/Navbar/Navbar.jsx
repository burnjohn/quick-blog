import React, { useCallback, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react' // eslint-disable-line no-unused-vars
import { assets } from '../../../assets/assets'
import { useAppContext } from '../../../context/AppContext'
import { ROUTES } from '../../../constants/routes'
import { EASE_EDITORIAL } from '../../ui/Reveal'
import { classNames } from '../../../utils/helpers'
import { formatDateline, getIssueNumber } from '../../blog/helpers'
import { NAV_LINKS } from './navLinks'
import MobileDrawer from './MobileDrawer'

// Height of the dateline strip; the header slides up by exactly this much once the page scrolls
const DATELINE_PX = 32
const CONDENSE_AFTER_PX = 48
const TODAY = new Date()
const HEADER_TRANSITION = { duration: 0.35, ease: EASE_EDITORIAL }

function Dateline({ storyCount }) {
  return (
    <div className='h-8 bg-ink text-paper/70'>
      <div className='mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 font-mono text-[10px] uppercase tracking-[0.2em] sm:px-8'>
        <span>Vol. I · Nº {getIssueNumber(TODAY)}</span>
        <span className='hidden sm:inline'>{formatDateline(TODAY)}</span>
        <span className='inline-flex items-center gap-2 text-paper'>
          <span aria-hidden='true' className='inline-block h-1.5 w-1.5 bg-signal' />
          {storyCount > 0 ? `${storyCount} stories live` : 'Live edition'}
        </span>
      </div>
    </div>
  )
}

function Navbar() {
  const { navigate, token, blogs } = useAppContext()
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > CONDENSE_AFTER_PX
    if (next !== condensed) setCondensed(next)
  })

  // Stable: the focus-trap effect depends on it
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const goToAccount = () => {
    setMenuOpen(false)
    navigate(ROUTES.ADMIN)
  }

  const accountLabel = token ? 'Dashboard' : 'Login'

  return (
    <>
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:text-ink'
      >
        Skip to content
      </a>

      <motion.header
        animate={{ y: condensed ? -DATELINE_PX : 0 }}
        transition={HEADER_TRANSITION}
        className='sticky top-0 z-40'
      >
        <Dateline storyCount={blogs?.length ?? 0} />

        <div className='relative border-b border-ink bg-paper/95 backdrop-blur-md'>
          <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8'>
            <button
              type='button'
              onClick={() => navigate(ROUTES.HOME)}
              aria-label='QuickBlog — go to home'
              className='group flex min-h-11 items-center gap-3 cursor-pointer'
            >
              <img
                src={assets.logo_mark}
                alt='logo'
                className='h-9 w-9 border border-ink transition-transform duration-300 group-hover:-rotate-6 sm:h-10 sm:w-10'
              />
              <motion.span
                animate={{ scale: condensed ? 0.9 : 1 }}
                transition={HEADER_TRANSITION}
                className='origin-left font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]'
              >
                QuickBlog<span className='text-signal [-webkit-text-stroke:1px_var(--color-ink)]'>.</span>
              </motion.span>
            </button>

            <nav aria-label='Sections' className='hidden lg:block'>
              <ul className='flex items-center gap-1 xl:gap-2'>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className='group relative inline-flex min-h-11 items-center px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink'
                    >
                      {link.label}
                      <span
                        aria-hidden='true'
                        className='absolute inset-x-2 bottom-2 h-0.5 origin-left scale-x-0 bg-ink transition-transform duration-200 ease-editorial group-hover:scale-x-100 group-focus-visible:scale-x-100'
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={goToAccount}
                className='group hidden min-h-11 items-center gap-3 border border-ink bg-ink px-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-paper shadow-hard-sm transition-[transform,box-shadow,background-color,color] duration-200 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-signal hover:text-ink sm:inline-flex'
              >
                {accountLabel}
                <span aria-hidden='true' className='transition-transform duration-200 group-hover:translate-x-1'>→</span>
              </button>

              <button
                ref={menuButtonRef}
                type='button'
                onClick={() => setMenuOpen(true)}
                aria-label='Open menu'
                aria-expanded={menuOpen}
                aria-controls='mobile-menu'
                className='inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-ink bg-signal cursor-pointer lg:hidden'
              >
                <span aria-hidden='true' className='block h-0.5 w-5 bg-ink' />
                <span aria-hidden='true' className='block h-0.5 w-5 bg-ink' />
                <span aria-hidden='true' className='block h-0.5 w-3 self-start ml-3 bg-ink' />
              </button>
            </div>
          </div>

          <span
            aria-hidden='true'
            className={classNames(
              'pointer-events-none absolute inset-x-0 top-full h-1 bg-ink transition-opacity duration-300',
              condensed ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
      </motion.header>

      <MobileDrawer
        open={menuOpen}
        onClose={closeMenu}
        onAccount={goToAccount}
        accountLabel={accountLabel}
        returnFocusRef={menuButtonRef}
      />
    </>
  )
}

export default Navbar
