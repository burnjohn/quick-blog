import React from 'react'
import { assets } from '../../../../assets/assets'
import { useBlogActions } from '../../../../hooks'
import { formatDate } from '../../../../utils/formatters'

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
    const result = await togglePublish(blog._id, blog.isPublished)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  return (
    <tr className='border-t border-border hover:bg-muted/60 transition-colors duration-200'>
      <th className='px-2 py-4 xl:px-6 font-normal text-muted-foreground'>{index}</th>
      <td className='px-2 py-4 font-medium text-foreground'>{title}</td>
      <td className='px-2 py-4 max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <span className={blog.isPublished ? 'text-success font-medium' : 'text-warning font-medium'}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className='px-2 py-4'>
        <div className='flex items-center text-xs gap-3'>
          <button 
            onClick={handleTogglePublish}
            disabled={inProgress}
            className='border border-border bg-card text-foreground px-3 py-1.5 rounded-full cursor-pointer hover:bg-muted transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            disabled={inProgress}
            className='cursor-pointer rounded-full hover:opacity-80 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
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
