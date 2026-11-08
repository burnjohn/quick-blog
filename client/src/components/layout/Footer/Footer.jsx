import React from 'react'
import { footer_data } from '../../../assets/assets'
import Logo from '../../ui/Logo'

function Footer() {
  return (
    <footer className='px-6 md:px-16 lg:px-24 xl:px-32 border-t border-border bg-card'>
      <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-border text-muted-foreground'>

        <div>
          <Logo className='w-32 sm:w-40' />
          <p className='max-w-[410px] mt-6 text-sm leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>

        <div className='flex flex-wrap justify-between w-full md:w-[45%] gap-8'>
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className='font-semibold text-sm uppercase tracking-wider text-foreground md:mb-5 mb-2'>
                {section.title}
              </h3>
              <ul className='text-sm space-y-2'>
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href='#' className='hover:text-accent transition-colors duration-200'>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className='py-5 text-center text-sm text-muted-foreground'>
        Copyright 2025 © QuickBlog GreatStack - All Right Reserved.
      </p>
    </footer>
  )
}

export default Footer
