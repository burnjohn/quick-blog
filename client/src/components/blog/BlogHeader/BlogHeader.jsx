import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { formatDate, getInitials } from '../../../utils/formatters'
import { EASE_EDITORIAL } from '../../ui/Reveal'
import Sticker from '../../ui/Sticker'
import { getReadingTime } from '../helpers'

const DEFAULT_AUTHOR = 'Michael Brown'

const rise = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE_EDITORIAL }
})

/** `children` render at the start of the dateline row (e.g. a back link) */
function BlogHeader({ blog, author, children }) {
  const byline = author ?? blog.authorName ?? DEFAULT_AUTHOR
  const minutes = getReadingTime(blog.description)

  return (
    <header className='mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14'>
      <div className='flex flex-wrap items-center gap-x-5 gap-y-3 border-b-2 border-ink pb-4 font-mono text-[11px] uppercase tracking-[0.18em]'>
        {children}
        {blog.category && <Sticker size='md'>{blog.category}</Sticker>}
        <span className='text-ink-muted'>
          Published on <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
        </span>
      </div>

      <div className='grid gap-10 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-end'>
        <div className='lg:col-span-9'>
          <motion.h1
            {...rise(0.05)}
            className='font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-8xl'
          >
            {blog.title}
          </motion.h1>

          {blog.subTitle && (
            <motion.h2
              {...rise(0.15)}
              className='mt-8 max-w-3xl border-l-4 border-signal pl-5 font-serif text-2xl italic leading-snug text-ink-muted sm:text-3xl'
            >
              {blog.subTitle}
            </motion.h2>
          )}
        </div>

        <motion.div
          {...rise(0.25)}
          className='flex items-stretch gap-0 border border-ink bg-surface shadow-hard lg:col-span-3 lg:flex-col'
        >
          <div className='flex flex-1 items-center gap-4 p-4 lg:border-b lg:border-ink'>
            <span
              aria-hidden='true'
              className='flex h-12 w-12 shrink-0 items-center justify-center border border-ink bg-ink font-mono text-sm text-signal'
            >
              {getInitials(byline)}
            </span>
            <div className='font-mono text-[11px] uppercase tracking-[0.14em]'>
              <span className='block text-ink-muted'>Written by</span>
              <span className='mt-1 block font-sans text-sm font-semibold normal-case tracking-normal text-ink'>{byline}</span>
            </div>
          </div>
          <div className='halftone flex shrink-0 flex-col justify-center border-l border-ink px-5 py-3 lg:border-l-0'>
            <span className='self-start bg-signal font-mono text-3xl font-medium leading-none tabular-nums text-ink'>
              {minutes}<span className='text-base'> min</span>
            </span>
            <span className='mt-1 self-start bg-signal font-mono text-[10px] uppercase tracking-[0.18em] text-ink'>Reading time</span>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default BlogHeader
