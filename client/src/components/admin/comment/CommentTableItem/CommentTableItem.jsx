import React from 'react'
import { Badge } from '../../../ui'
import { useCommentActions } from '../../../../hooks'
import { formatDate } from '../../../../utils/formatters'

function CommentTableItem({ comment, onUpdate }) {
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
    <tr className='border-b border-line align-top transition-colors last:border-b-0 hover:bg-paper'>
      <td className='px-4 py-5'>
        <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2'>
          <dt className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'>Blog</dt>
          <dd className='font-medium text-ink'>{blog?.title}</dd>
          <dt className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'>Name</dt>
          <dd className='text-ink'>{comment.name}</dd>
          <dt className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'>Comment</dt>
          <dd className='text-ink'>{comment.content}</dd>
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
              className='min-h-10 border border-success px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-success cursor-pointer transition-colors hover:bg-success hover:text-surface disabled:opacity-50 disabled:cursor-not-allowed'
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
            className='flex h-10 w-10 items-center justify-center border border-line text-lg text-danger cursor-pointer transition-colors hover:border-danger hover:bg-danger hover:text-surface disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Delete comment'
          >
            <span aria-hidden='true'>✕</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem
