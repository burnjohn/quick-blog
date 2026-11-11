import React from 'react'
import { footer_data } from '../../../assets/assets'

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className='bg-ink text-paper'>
      <div className='mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24'>
        <div className='grid gap-12 border-b border-paper/20 pb-14 md:grid-cols-12'>
          <div className='md:col-span-5'>
            <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>
              About
            </p>
            <p className='mt-4 max-w-sm font-serif text-2xl leading-snug'>
              An independent journal of essays and notes on technology, startups, lifestyle and money.
            </p>
          </div>

          <nav aria-label='Footer' className='grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7'>
            {footer_data.map((section) => (
              <div key={section.title}>
                <h3 className='mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60'>
                  {section.title}
                </h3>
                <ul className='space-y-2.5 text-sm'>
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href='#'
                        className='decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-signal hover:underline'
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p
          aria-hidden='true'
          className='select-none overflow-hidden whitespace-nowrap pt-8 font-serif text-[16vw] font-semibold leading-[0.85] tracking-tighter text-paper xl:text-[13rem]'
        >
          QuickBlog<span className='text-signal'>.</span>
        </p>

        <div className='flex flex-col gap-2 border-t border-paper/20 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 sm:flex-row sm:justify-between'>
          <p>© {CURRENT_YEAR} QuickBlog. All rights reserved.</p>
          <p>Made with ink &amp; signal</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
