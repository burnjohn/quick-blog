import { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useBlogActions() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const { axios } = useAppContext()
  const { mutate, error } = useApiMutation()

  const deleteBlog = async (blogId) => {
    setIsDeleting(true)
    
    const result = await mutate(
      () => axios.post('/api/blog/delete', { id: blogId }),
      {
        confirmMessage: 'Are you sure you want to delete this blog?',
        successMessage: MESSAGES.SUCCESS_BLOG_DELETED,
        errorMessage: MESSAGES.ERROR_DELETE_BLOG
      }
    )
    
    setIsDeleting(false)
    return result
  }

  const togglePublish = async (blogId, isCurrentlyPublished) => {
    setIsToggling(true)

    const endpoint = isCurrentlyPublished ? '/api/blog/unpublish' : '/api/blog/publish'
    const result = await mutate(
      () => axios.post(endpoint, { id: blogId }),
      {
        successMessage: MESSAGES.SUCCESS_BLOG_UPDATED,
        errorMessage: MESSAGES.ERROR_UPDATE_BLOG
      }
    )

    setIsToggling(false)
    return result
  }

  return {
    deleteBlog,
    togglePublish,
    isDeleting,
    isToggling,
    inProgress: isDeleting || isToggling,
    error
  }
}

