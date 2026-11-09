import React from 'react'
import { assets } from '../../../../assets/assets'
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
    <tr className='text-muted transition-colors hover:bg-white/[0.04]'>
      <td className='px-4 py-4 sm:px-6'>
        <div className='space-y-2 break-words'>
          <p>
            <span className='font-medium text-ink'>Blog:</span> {blog.title}
          </p>
          <p>
            <span className='font-medium text-ink'>Name:</span> {comment.name}
          </p>
          <p>
            <span className='font-medium text-ink'>Comment:</span> {comment.content}
          </p>
        </div>
      </td>
      <td className='px-4 py-4 sm:px-6 max-sm:hidden'>
        {formatDate(createdAt)}
      </td>
      <td className='px-4 py-4 sm:px-6'>
        <div className='inline-flex items-center gap-4'>
          {!comment.isApproved ? (
            <button
              onClick={handleApprove}
              disabled={inProgress}
              className='grid size-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Approve comment'
            >
              <img src={assets.tick_icon} className='w-4 invert opacity-80' alt='' />
            </button>
          ) : (
            <Badge variant='success' size='sm'>
              Approved
            </Badge>
          )}
          <button
            onClick={handleDelete}
            disabled={inProgress}
            className='grid size-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Delete comment'
          >
            <img src={assets.bin_icon} alt='' className='w-4 invert opacity-80' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem
