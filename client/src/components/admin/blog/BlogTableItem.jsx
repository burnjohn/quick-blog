import React from 'react'
import { assets } from '../../../assets/assets'
import { useBlogActions } from '../../../hooks'
import { formatDate } from '../../../utils/formatters'

function BlogTableItem({ blog, onUpdate, index }) {
  const { title, createdAt } = blog
  const { deleteBlog, togglePublish, inProgress } = useBlogActions()

  const handleDelete = async () => {
    const result = await deleteBlog(blog._id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  const handleTogglePublish = async () => {
    const result = await togglePublish(blog._id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  return (
    <tr className='border-y border-gray-300 hover:bg-gray-50 transition-colors'>
      <th className='px-2 py-4 font-normal'>{index}</th>
      <td className='px-2 py-4'>{title}</td>
      <td className='px-2 py-4 max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <span className={blog.isPublished ? 'text-green-600' : 'text-orange-700'}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className='px-2 py-4'>
        <div className='flex items-center text-xs gap-3'>
          <button 
            onClick={handleTogglePublish}
            disabled={inProgress}
            className='border px-2 py-1 rounded cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            disabled={inProgress}
            className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Delete blog'
          >
            <img src={assets.cross_icon} className='w-8' alt='' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem
