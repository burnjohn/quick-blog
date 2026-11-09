import React from 'react'
import BlogCard from '../BlogCard'
import { Reveal } from '../../effects'

function BlogGrid({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className='py-20 text-center'>
        <p className='text-lg text-muted'>No blogs found.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {blogs.map((blog, i) => (
        <Reveal key={blog._id} delay={(i % 6) * 0.06} className='h-full'>
          <BlogCard blog={blog} index={i} />
        </Reveal>
      ))}
    </div>
  )
}

export default BlogGrid
