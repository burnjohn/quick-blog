import React from 'react'
import { Badge } from '../../../ui'
import { useCommentActions } from '../../../../hooks'
import { formatDate } from '../../../../utils/formatters'
import { AdminTableRow } from '../../shared/AdminTable'

const LABEL_CLASS = 'font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'

function CommentTableItem({ comment, onUpdate, index = 0 }) {
  const { blog, createdAt, _id } = comment
  const { approveComment, deleteComment, inProgress } = useCommentActions()

  const handleApprove = async () => {
    const result = await approveComment(_id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    const result = await deleteComment(_id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  return (
    <AdminTableRow index={index} className='align-top'>
      <td className='px-4 py-5'>
        <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2'>
          <dt className={LABEL_CLASS}>Blog</dt>
          <dd className='font-serif text-base font-semibold leading-snug text-ink'>{blog?.title}</dd>
          <dt className={LABEL_CLASS}>Name</dt>
          <dd className='text-ink'>{comment.name}</dd>
          <dt className={LABEL_CLASS}>Comment</dt>
          <dd className='border-l-4 border-signal pl-3 text-ink'>{comment.content}</dd>
        </dl>
      </td>
      <td className='px-4 py-5 font-mono text-xs text-ink-muted max-sm:hidden'>
        {formatDate(createdAt)}
      </td>
      <td className='px-4 py-5'>
        <div className='inline-flex items-center gap-2'>
          {!comment.isApproved ? (
            <button
              type='button'
              onClick={handleApprove}
              disabled={inProgress}
              className='min-h-11 cursor-pointer border border-success bg-surface px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-success shadow-hard-sm transition-[transform,box-shadow,background-color,color] duration-200 hover:-translate-x-px hover:-translate-y-px hover:bg-success hover:text-surface active:translate-x-0 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Approve comment'
            >
              ✓ Approve
            </button>
          ) : (
            <Badge variant='success' size='sm'>
              Approved
            </Badge>
          )}
          <button
            type='button'
            onClick={handleDelete}
            disabled={inProgress}
            className='flex h-11 w-11 cursor-pointer items-center justify-center border border-line text-lg text-danger transition-colors hover:border-danger hover:bg-danger hover:text-surface disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Delete comment'
          >
            <span aria-hidden='true'>✕</span>
          </button>
        </div>
      </td>
    </AdminTableRow>
  )
}

export default CommentTableItem
