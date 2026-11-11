import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import BlogCard from '../BlogCard'
import LeadCard from '../LeadCard'

const STAGGER_SECONDS = 0.05
const EASE_OUT = [0.22, 1, 0.36, 1]

function EmptyState({ onReset }) {
  return (
    <div className='border border-dashed border-ink bg-surface px-6 py-20 text-center sm:py-28'>
      <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
        Nothing on this page
      </p>
      <p className='mt-4 font-serif text-4xl font-semibold text-ink sm:text-6xl'>
        No blogs found.
      </p>
      <p className='mx-auto mt-4 max-w-md text-ink-muted'>
        Try another search term or pick a different category.
      </p>
      {onReset && (
        <button
          type='button'
          onClick={onReset}
          className='mt-8 inline-flex min-h-11 items-center border border-ink bg-signal px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink cursor-pointer transition-colors hover:bg-ink hover:text-signal'
        >
          Show all stories
        </button>
      )}
    </div>
  )
}

function BlogGrid({ blogs, onReset }) {
  if (!blogs || blogs.length === 0) {
    return <EmptyState onReset={onReset} />
  }

  const [lead, ...rest] = blogs

  return (
    <div className='flex flex-col gap-8'>
      <motion.div
        key={lead._id}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <LeadCard blog={lead} />
      </motion.div>

      {rest.length > 0 && (
        <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {rest.map((blog, index) => (
            <motion.li
              key={blog._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: (index + 1) * STAGGER_SECONDS, ease: EASE_OUT }}
            >
              <BlogCard blog={blog} index={index + 1} />
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BlogGrid
