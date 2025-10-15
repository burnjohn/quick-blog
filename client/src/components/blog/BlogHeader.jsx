import React from 'react'
import { formatDate } from '../../utils/formatters'
import Badge from '../ui/Badge'

function BlogHeader({ blog, author = 'Michael Brown' }) {
  return (
    <div className='text-center mt-20 text-gray-600'>
      <p className='text-primary py-4 font-medium'>
        Published on {formatDate(blog.createdAt)}
      </p>
      <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
        {blog.title}
      </h1>
      {blog.subTitle && (
        <h2 className='my-5 max-w-lg truncate mx-auto'>
          {blog.subTitle}
        </h2>
      )}
      <Badge variant='primary' className='mb-6'>
        {author}
      </Badge>
    </div>
  )
}

export default BlogHeader

