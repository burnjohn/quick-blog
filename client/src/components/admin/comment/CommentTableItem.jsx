import React from 'react'
import { assets } from '../../../assets/assets'
import { useCommentActions } from '../../../hooks'
import { formatDate, truncateText, stripHtmlTags } from '../../../utils/formatters'
import { getBlogDetailPath } from '../../../constants/routes'
import { useAppContext } from '../../../context/AppContext'

function CommentTableItem({ comment, onUpdate, index }) {
  const { name, content, isApproved, createdAt, blog } = comment
  const { approveComment, deleteComment, inProgress } = useCommentActions()
  const { navigate } = useAppContext()

  const handleApprove = async () => {
    const result = await approveComment(comment._id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  const onDelete = async () => {
    const result = await deleteComment(comment._id)
    if (result.success && onUpdate) {
      onUpdate()
    }
  }

  const onBlogClick = (e) => {
    e.preventDefault()
    if (blog?._id) {
      navigate(getBlogDetailPath(blog._id))
    }
  }

  const blogTitle = blog?.title || 'Unknown Blog'
  const truncatedContent = truncateText(stripHtmlTags(content), 60)

  return (
    <tr className='border-y border-gray-300 hover:bg-gray-50 transition-colors'>
      <th className='px-2 py-4 font-normal'>{index}</th>
      <td className='px-2 py-4'>{name}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        {blog?._id ? (
          <button
            onClick={onBlogClick}
            className='text-blue-600 hover:text-blue-800 hover:underline text-left'
          >
            {truncateText(blogTitle, 40)}
          </button>
        ) : (
          <span className='text-gray-400'>{blogTitle}</span>
        )}
      </td>
      <td className='px-2 py-4'>{truncatedContent}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <span className={isApproved ? 'text-green-600' : 'text-orange-700'}>
          {isApproved ? 'Approved' : 'Pending'}
        </span>
      </td>
      <td className='px-2 py-4 max-sm:hidden'>{formatDate(createdAt)}</td>
      <td className='px-2 py-4'>
        <div className='flex items-center text-xs gap-3'>
          {!isApproved && (
            <button
              onClick={handleApprove}
              disabled={inProgress}
              className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Approve comment'
            >
              <img src={assets.comment_approve} className='w-6' alt='Approve' />
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={inProgress}
            className='hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Delete comment'
          >
            <img src={assets.comment_delete} className='w-6' alt='Delete' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem

