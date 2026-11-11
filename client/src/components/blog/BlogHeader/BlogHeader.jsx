import React from 'react'
import { formatDate, getInitials } from '../../../utils/formatters'

function BlogHeader({ blog, author = 'Michael Brown' }) {
  return (
    <header className='mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-20'>
      <div className='flex flex-wrap items-center gap-3 border-b border-ink pb-4 font-mono text-[11px] uppercase tracking-[0.18em]'>
        {blog.category && (
          <span className='bg-signal px-2 py-0.5 text-ink'>{blog.category}</span>
        )}
        <span className='text-ink-muted'>
          Published on <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
        </span>
      </div>

      <h1 className='mt-10 max-w-5xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-8xl'>
        {blog.title}
      </h1>

      {blog.subTitle && (
        <h2 className='mt-8 max-w-3xl font-serif text-2xl italic leading-snug text-ink-muted sm:text-3xl'>
          {blog.subTitle}
        </h2>
      )}

      <div className='mt-10 flex items-center gap-4'>
        <span
          aria-hidden='true'
          className='flex h-12 w-12 items-center justify-center border border-ink bg-ink font-mono text-sm text-signal'
        >
          {getInitials(author)}
        </span>
        <div className='font-mono text-[11px] uppercase tracking-[0.14em]'>
          <span className='block text-ink-muted'>Written by</span>
          <span className='mt-1 block text-sm normal-case tracking-normal text-ink font-sans font-semibold'>{author}</span>
        </div>
      </div>
    </header>
  )
}

export default BlogHeader
