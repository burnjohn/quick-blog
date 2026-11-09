import React from 'react'
import { assets, footer_data } from '../../../assets/assets'

function Footer() {
  return (
    <footer className='relative mt-12 overflow-hidden border-t border-white/10 px-6 pt-16 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-col items-start justify-between gap-12 pb-12 md:flex-row'>
        <div>
          <img src={assets.logo} alt='logo' className='w-32 brightness-0 invert sm:w-44' />
          <p className='mt-6 max-w-[410px] text-muted'>
            A quiet corner of the internet for sharp ideas, honest stories and the tools to publish them.
          </p>
          <p className='mt-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>
            <span className='size-1.5 rounded-full bg-lime' />
            SYS / ONLINE
          </p>
        </div>

        <div className='grid w-full grid-cols-2 gap-8 sm:grid-cols-3 md:w-[50%]'>
          {footer_data.map((section) => (
            <div key={section.title}>
              <h3 className='mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary'>
                {section.title}
              </h3>
              <ul className='space-y-2 text-sm'>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className='text-ink/80 transition hover:text-lime'>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden='true'
        className='pointer-events-none select-none text-center font-display text-[clamp(3rem,17vw,16rem)] font-bold leading-[0.8] tracking-tighter text-white/[0.06]'
      >
        QUICKBLOG
      </div>

      <p className='border-t border-white/10 py-5 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>
        © 2026 QuickBlog
      </p>
    </footer>
  )
}

export default Footer
