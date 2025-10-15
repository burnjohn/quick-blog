import { useState } from 'react'
import { parse } from 'marked'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'

export function useBlogGenerator() {
  const [generatedContent, setGeneratedContent] = useState(null)
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const generateContent = async (prompt) => {
    if (!prompt || !prompt.trim()) {
      toast.error('Please enter a title')
      return { success: false, message: 'Title required' }
    }

    const result = await mutate(
      () => axios.post('/api/blog/generate', { prompt }),
      {
        successMessage: 'Content generated successfully!',
        errorMessage: MESSAGES.ERROR_GENERIC,
        onSuccess: (data) => {
          const parsedContent = parse(data.content)
          setGeneratedContent(parsedContent)
        }
      }
    )

    if (result.success) {
      return { success: true, content: generatedContent }
    }

    return result
  }

  const clearContent = () => {
    setGeneratedContent(null)
  }

  return {
    generateContent,
    clearContent,
    generatedContent,
    isGenerating: loading,
    inProgress: loading,
    error
  }
}

