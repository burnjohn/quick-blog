import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { useAppContext } from '../../../context/AppContext'
import SearchBar from '../SearchBar'
import CategoryTicker from '../../blog/CategoryTicker'

const EASE_OUT = [0.22, 1, 0.36, 1]

function Header() {
  const { setInput, input, blogs } = useAppContext()

  const handleSearch = (searchTerm) => {
    setInput(searchTerm)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <section aria-labelledby='hero-title' className='relative'>
      <div className='mx-auto max-w-7xl px-5 pt-12 pb-14 sm:px-8 sm:pt-20 sm:pb-20'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
          <span>Issue Nº01 — The QuickBlog Journal</span>
          <span className='inline-flex items-center gap-2 text-ink'>
            <span aria-hidden='true' className='inline-block h-2 w-2 bg-signal ring-1 ring-ink' />
            {blogs?.length ? `${blogs.length} stories` : 'Fresh stories'} · AI-assisted writing
          </span>
        </div>

        <div className='mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end'>
          <motion.h1
            id='hero-title'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className='font-serif text-[3.5rem] font-semibold leading-[0.92] tracking-tight text-ink sm:text-8xl lg:col-span-8 xl:text-[8.5rem]'
          >
            Your own{' '}
            <em className='relative inline-block font-normal'>
              <span className='relative z-10'>blogging</span>
              <span aria-hidden='true' className='absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.28em] bg-signal' />
            </em>
            <br />
            platform.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
            className='lg:col-span-4 lg:pb-3'
          >
            <p className='max-w-md text-lg leading-relaxed text-ink-muted'>
              This is your space to think out loud, to share what matters, and to write without filters.
              Whether it's one word or a thousand, your story starts right here.
            </p>
          </motion.div>
        </div>

        <div className='mt-12 sm:mt-16'>
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClear}
            hasSearchTerm={!!input}
          />
        </div>
      </div>

      <CategoryTicker />
    </section>
  )
}

export default Header
