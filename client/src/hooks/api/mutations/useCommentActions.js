import { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useCommentActions() {
  const [isApproving, setIsApproving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { axios } = useAppContext()
  const { mutate, error } = useApiMutation()

  const approveComment = async (commentId) => {
    setIsApproving(true)
    
    const result = await mutate(
      () => axios.post('/api/admin/approve-comment', { id: commentId }),
      {
        successMessage: MESSAGES.SUCCESS_COMMENT_APPROVED,
        errorMessage: MESSAGES.ERROR_GENERIC
      }
    )
    
    setIsApproving(false)
    return result
  }

  const deleteComment = async (commentId) => {
    setIsDeleting(true)
    
    const result = await mutate(
      () => axios.post('/api/admin/delete-comment', { id: commentId }),
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

