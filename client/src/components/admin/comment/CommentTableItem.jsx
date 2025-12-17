import React from 'react'
import { assets } from '../../../assets/assets'
import { useCommentActions } from '../../../hooks'
import { formatDate } from '../../../utils/formatters'

function CommentTableItem({ comment, onUpdate, index }) {
  const { name, content, createdAt, blog, isApproved } = comment
  const { approveComment, deleteComment, inProgress } = useCommentActions()

  const handleApprove = async () => {
    const result = await approveComment(comment._id, !isApproved)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    const result = await deleteComment(comment._id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  const blogTitle = blog?.title || 'Unknown Blog'

  return (
    <tr className='border-y border-gray-300 hover:bg-gray-50 transition-colors'>
      <th className='px-2 py-4 font-normal'>{index}</th>
      <td className='px-2 py-4'>
        <div className='flex flex-col gap-1'>
          <div className='font-semibold text-gray-900'>{blogTitle}</div>
          <div className='text-sm'>
            <span className='font-medium text-gray-700'>Name:</span>{' '}
            <span className='text-gray-600'>{name}</span>
          </div>
          <div className='text-sm'>
            <span className='font-medium text-gray-700'>Comment:</span>{' '}
            <span className='text-gray-600'>{content}</span>
          </div>
        </div>
      </td>
      <td className='px-2 py-4 max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-2 py-4'>
        <div className='flex items-center text-xs gap-3'>
          <button
            onClick={handleApprove}
            disabled={inProgress}
            className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label={isApproved ? 'Unapprove comment' : 'Approve comment'}
            title={isApproved ? 'Unapprove' : 'Approve'}
          >
            <img 
              src={assets.tick_icon} 
              className={`w-6 h-6 ${isApproved ? 'opacity-100' : 'opacity-40'}`} 
              alt='' 
            />
          </button>
          <button
            onClick={handleDelete}
            disabled={inProgress}
            className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Delete comment'
          >
            <img src={assets.cross_icon} className='w-8' alt='' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem

