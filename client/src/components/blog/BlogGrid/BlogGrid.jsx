import React from 'react'
import BlogCard from '../BlogCard'
import Reveal from '../../ui/Reveal'

function EmptyState({ onReset }) {
  return (
    <div className='relative overflow-hidden border-2 border-dashed border-ink bg-surface px-6 py-20 text-center sm:py-28'>
      <span aria-hidden='true' className='halftone absolute -right-10 -top-10 h-40 w-40 rotate-12 border-2 border-ink opacity-70' />
      <p className='relative font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
        Nothing on this page
      </p>
      <p className='relative mt-4 font-serif text-4xl font-semibold text-ink sm:text-6xl'>
        No blogs found.
      </p>
      <p className='relative mx-auto mt-4 max-w-md text-ink-muted'>
        Try another search term or pick a different category.
      </p>
      {onReset && (
        <button
          type='button'
          onClick={onReset}
          className='relative mt-8 inline-flex min-h-11 items-center border border-ink bg-signal px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink shadow-hard-sm cursor-pointer transition-colors hover:bg-ink hover:text-signal'
        >
          Show all stories
        </button>
      )}
    </div>
  )
}

/** Staggered card grid; `staggerFrom` restarts the stagger for appended pages */
function BlogGrid({ blogs, onReset, staggerFrom = 0 }) {
  if (!blogs || blogs.length === 0) {
    return <EmptyState onReset={onReset} />
  }

  return (
    <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
      {blogs.map((blog, index) => (
        <Reveal as='li' key={blog._id} index={Math.max(0, index - staggerFrom)}>
          <BlogCard blog={blog} index={index} />
        </Reveal>
      ))}
    </ul>
  )
}

export default BlogGrid
