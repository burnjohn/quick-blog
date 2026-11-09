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
    <tr className='text-muted transition-colors hover:bg-white/[0.04]'>
      <th className='px-2 py-4 font-mono font-normal text-faint xl:px-6'>{index}</th>
      <td className='px-2 py-4 text-ink'>{title}</td>
      <td className='px-2 py-4 max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <span className={`font-mono text-xs uppercase tracking-wider ${blog.isPublished ? 'text-lime' : 'text-ember'}`}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className='px-2 py-4'>
        <div className='flex items-center gap-2 text-xs'>
          <button
            onClick={handleTogglePublish}
            disabled={inProgress}
            className='cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-1 text-ink transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            disabled={inProgress}
            className='grid size-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-ember/50 hover:bg-ember/10 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Delete blog'
          >
            <img src={assets.cross_icon} className='w-5 invert opacity-80' alt='' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem
