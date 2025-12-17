import { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useCommentActions() {
  const [isApproving, setIsApproving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { axios } = useAppContext()
  const { mutate, error } = useApiMutation()

  const approveComment = async (commentId, isApproved) => {
    setIsApproving(true)
    
    const result = await mutate(
      () => axios.post('/api/admin/comments/approve', {
        id: commentId,
        isApproved
      }),
      {
        successMessage: isApproved 
          ? MESSAGES.SUCCESS_COMMENT_APPROVED 
          : MESSAGES.SUCCESS_COMMENT_UNAPPROVED,
        errorMessage: MESSAGES.ERROR_UPDATE_COMMENT
      }
    )
    
    setIsApproving(false)
    return result
  }

  const deleteComment = async (commentId) => {
    setIsDeleting(true)
    
    const result = await mutate(
      () => axios.post('/api/admin/comments/delete', { id: commentId }),
      {
        confirmMessage: 'Are you sure you want to delete this comment?',
        successMessage: MESSAGES.SUCCESS_COMMENT_DELETED,
        errorMessage: MESSAGES.ERROR_DELETE_COMMENT
      }
    )
    
    setIsDeleting(false)
    return result
  }

  return {
    approveComment,
    deleteComment,
    isApproving,
    isDeleting,
    inProgress: isApproving || isDeleting,
    error
  }
}

