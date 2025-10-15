import React from 'react'
import { assets } from '../../../assets/assets'
import { Badge } from '../../ui'
import { useCommentActions } from '../../../hooks'
import { formatDate } from '../../../utils/formatters'

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
    <tr className='border-y border-gray-300 hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div className='space-y-2'>
          <p>
            <span className='font-medium text-gray-600'>Blog:</span> {blog.title}
          </p>
          <p>
            <span className='font-medium text-gray-600'>Name:</span> {comment.name}
          </p>
          <p>
            <span className='font-medium text-gray-600'>Comment:</span> {comment.content}
          </p>
        </div>
      </td>
      <td className='px-6 py-4 max-sm:hidden'>
        {formatDate(createdAt)}
      </td>
      <td className='px-6 py-4'>
        <div className='inline-flex items-center gap-4'>
          {!comment.isApproved ? (
            <button
              onClick={handleApprove}
              disabled={inProgress}
              className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Approve comment'
            >
              <img src={assets.tick_icon} className='w-5' alt='' />
            </button>
          ) : (
            <Badge variant='success' size='sm'>
              Approved
            </Badge>
          )}
          <button
            onClick={handleDelete}
            disabled={inProgress}
            className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Delete comment'
          >
            <img src={assets.bin_icon} alt='' className='w-5' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem
