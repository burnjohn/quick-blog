import React from 'react'
import { formatDate } from '../../../utils/formatters'
import Badge from '../../ui/Badge'

function BlogHeader({ blog, author = 'Michael Brown' }) {
  return (
    <header className='mx-5 mt-28 sm:mt-36 max-w-5xl md:mx-auto'>
      <div className='flex flex-wrap items-center gap-3'>
        <span className='size-1.5 rounded-full bg-lime' aria-hidden='true' />
        <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>
          Published on {formatDate(blog.createdAt)}
        </p>
      </div>
      <h1 className='mt-6 font-display text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter text-ink break-words'>
        {blog.title}
      </h1>
      {blog.subTitle && (
        <h2 className='mt-6 max-w-2xl text-lg sm:text-xl text-muted'>
          {blog.subTitle}
        </h2>
      )}
      <div className='mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6'>
        {blog.category && <Badge variant='secondary'>{blog.category}</Badge>}
        <Badge variant='primary'>{author}</Badge>
      </div>
    </header>
  )
}

export default BlogHeader
