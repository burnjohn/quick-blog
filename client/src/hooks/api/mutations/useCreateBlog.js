import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useCreateBlog() {
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const createBlog = async (blogData, imageFile) => {
    // Validate inputs before creating FormData
    if (!imageFile || typeof imageFile === 'boolean') {
      console.error('Invalid image file:', imageFile)
      return {
        success: false,
        message: 'Invalid image file'
      }
    }

    // Debug: Check what we're about to send
    console.log('useCreateBlog - blogData:', blogData)
    console.log('useCreateBlog - imageFile:', {
      name: imageFile?.name,
      size: imageFile?.size,
      type: imageFile?.type,
      file: imageFile
    })

    const formData = new FormData()
    formData.append('blog', JSON.stringify(blogData))
    formData.append('image', imageFile)

    // Debug: Check FormData contents
    console.log('FormData entries:')
    for (let pair of formData.entries()) {
      console.log(pair[0], ':', pair[1])
    }

    return mutate(
      () => axios.post('/api/blog/add', formData),
      {
        successMessage: MESSAGES.SUCCESS_BLOG_CREATED,
        errorMessage: MESSAGES.ERROR_CREATE_BLOG
      }
    )
  }

  return {
    createBlog,
    isCreating: loading,
    inProgress: loading,
    error
  }
}

