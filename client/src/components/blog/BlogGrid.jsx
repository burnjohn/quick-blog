import React from 'react'
import BlogCard from './BlogCard'

function BlogGrid({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-500 text-lg'>No blogs found.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogGrid

