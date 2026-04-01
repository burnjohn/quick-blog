import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

// Generic hook for handling API requests with loading, error, and success states
export function useApiRequest(options = {}) {
  const { showToast = true, defaultErrorMessage = 'Something went wrong' } = options
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall, config = {}) => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = defaultErrorMessage,
      showSuccessToast = showToast,
      showErrorToast = showToast
    } = config

    try {
      setLoading(true)
      setError(null)
      
      const { data } = await apiCall()
      
      if (data.success) {
        if (showSuccessToast && (successMessage || data.message)) {
          toast.success(successMessage || data.message)
        }
        
        if (onSuccess) {
          onSuccess(data)
        }
        
        return { success: true, data }
      } else {
        const errMsg = data.message || errorMessage
        setError(errMsg)
        
        if (showErrorToast) {
          toast.error(errMsg)
        }
        
        if (onError) {
          onError(errMsg)
        }
        
        return { success: false, message: errMsg }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || errorMessage
      setError(errMsg)
      
      if (showErrorToast) {
        toast.error(errMsg)
      }
      
      if (onError) {
        onError(errMsg)
      }
      
      return { success: false, message: errMsg }
    } finally {
      setLoading(false)
    }
  }, [showToast, defaultErrorMessage])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return {
    execute,
    loading,
    error,
    reset,
    inProgress: loading
  }
}

