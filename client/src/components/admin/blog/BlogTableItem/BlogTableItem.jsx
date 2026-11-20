import React from 'react'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { useBlogActions } from '../../../../hooks'
import { formatDate } from '../../../../utils/formatters'
import { classNames } from '../../../../utils/helpers'
import { AdminTableRow } from '../../shared/AdminTable'
import { EASE_EDITORIAL } from '../../shared/motion'

const STATUS_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_EDITORIAL } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
}

function StatusPill({ isPublished }) {
  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.span
        key={isPublished ? 'published' : 'draft'}
        {...STATUS_MOTION}
        className={classNames(
          'inline-flex items-center gap-2 border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em]',
          isPublished ? 'border-ink bg-ink text-signal' : 'border-dashed border-ink-muted text-ink-muted'
        )}
      >
        <span aria-hidden='true' className={classNames('h-2 w-2', isPublished ? 'bg-signal' : 'border border-ink-muted')} />
        {isPublished ? 'Published' : 'Unpublished'}
      </motion.span>
    </AnimatePresence>
  )
}

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
    <AdminTableRow index={index - 1}>
      <th scope='row' className='px-4 py-4 font-mono text-xs font-normal text-ink-muted'>
        {String(index).padStart(2, '0')}
      </th>
      <td className='px-4 py-4 font-serif text-base font-semibold leading-snug text-ink'>{title}</td>
      <td className='px-4 py-4 font-mono text-xs text-ink-muted max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-4 py-4 max-sm:hidden'>
        <StatusPill isPublished={blog.isPublished} />
      </td>
      <td className='px-4 py-4'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={handleTogglePublish}
            disabled={inProgress}
            className='min-h-11 cursor-pointer border border-ink bg-surface px-2 sm:min-w-28 sm:px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink shadow-hard-sm transition-[transform,box-shadow,background-color,color] duration-200 hover:-translate-x-px hover:-translate-y-px hover:bg-ink hover:text-signal active:translate-x-0 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
          >
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            type='button'
            onClick={handleDelete}
            disabled={inProgress}
            className='flex h-11 w-11 cursor-pointer items-center justify-center border border-line text-lg text-danger transition-colors hover:border-danger hover:bg-danger hover:text-surface disabled:cursor-not-allowed disabled:opacity-50'
            aria-label={`Delete blog "${title}"`}
          >
            <span aria-hidden='true'>✕</span>
          </button>
        </div>
      </td>
    </AdminTableRow>
  )
}

export default BlogTableItem
