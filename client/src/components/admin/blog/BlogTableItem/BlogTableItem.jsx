import React from 'react'
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
    <tr className='border-b border-line transition-colors last:border-b-0 hover:bg-paper'>
      <th scope='row' className='px-4 py-4 font-mono text-xs font-normal text-ink-muted'>
        {String(index).padStart(2, '0')}
      </th>
      <td className='px-4 py-4 font-medium text-ink'>{title}</td>
      <td className='px-4 py-4 font-mono text-xs text-ink-muted max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-4 py-4 max-sm:hidden'>
        <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] ${blog.isPublished ? 'text-success' : 'text-danger'}`}>
          <span aria-hidden='true' className={`h-2 w-2 ${blog.isPublished ? 'bg-success' : 'bg-danger'}`} />
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className='px-4 py-4'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={handleTogglePublish}
            disabled={inProgress}
            className='min-h-10 border border-ink px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink cursor-pointer transition-colors hover:bg-ink hover:text-signal disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            type='button'
            onClick={handleDelete}
            disabled={inProgress}
            className='flex h-10 w-10 items-center justify-center border border-line text-lg text-danger cursor-pointer transition-colors hover:border-danger hover:bg-danger hover:text-surface disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label={`Delete blog "${title}"`}
          >
            <span aria-hidden='true'>✕</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem
