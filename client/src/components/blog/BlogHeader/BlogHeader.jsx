import React from 'react'
import { formatDate } from '../../../utils/formatters'
import Badge from '../../ui/Badge'

function BlogHeader({ blog, author = 'Michael Brown' }) {
  return (
    <div className='text-center pt-16 sm:pt-24 px-6 text-muted-foreground'>
      <p className='text-accent py-4 text-sm font-semibold uppercase tracking-widest'>
        Published on {formatDate(blog.createdAt)}
      </p>
      <h1 className='font-display text-3xl sm:text-6xl font-bold tracking-tight leading-tight max-w-3xl mx-auto text-foreground'>
        {blog.title}
      </h1>
      {blog.subTitle && (
        <h2 className='my-6 max-w-xl truncate mx-auto text-lg'>
          {blog.subTitle}
        </h2>
      )}
      <Badge variant='secondary' className='mt-2 mb-8'>
        {author}
      </Badge>
    </div>
  )
}

export default BlogHeader

