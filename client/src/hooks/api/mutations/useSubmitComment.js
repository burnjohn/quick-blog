import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useSubmitComment() {
  const { axios } = useAppContext()
  const { mutate, error } = useApiMutation()

  const submitComment = async (blogId, commentData) => {
    const result = await mutate(
      () => axios.post('/api/comment/add', {
        blog: blogId,
        name: commentData.name,
        content: commentData.comment
      }),
      {
        successMessage: MESSAGES.SUCCESS_COMMENT_SUBMITTED,
        errorMessage: MESSAGES.ERROR_SUBMIT_COMMENT
      }
    )
    
    return result
  }

  return {
    submitComment,
    error
  }
}

