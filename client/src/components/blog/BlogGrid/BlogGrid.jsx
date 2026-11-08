import React from 'react'
import BlogCard from '../BlogCard'

function BlogGrid({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-muted-foreground text-lg'>No blogs found.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-24 mx-6 sm:mx-16 xl:mx-32'>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogGrid

