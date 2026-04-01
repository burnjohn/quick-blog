import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

// Hook for data mutations (POST, PUT, DELETE requests)
export function useApiMutation(options = {}) {
  const { showToast = true } = options
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (apiCall, config = {}) => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = 'Operation failed',
      showSuccessToast = showToast,
      showErrorToast = showToast,
      confirmMessage
    } = config

    // Handle confirmation if needed
    if (confirmMessage) {
      const confirmed = window.confirm(confirmMessage)
      if (!confirmed) {
        return { success: false, cancelled: true }
      }
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data } = await apiCall()
      
      if (data.success) {
        if (showSuccessToast && (successMessage || data.message)) {
          toast.success(successMessage || data.message)
        }
        
        if (onSuccess) {
          await onSuccess(data)
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
  }, [showToast])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return {
    mutate,
    loading,
    error,
    reset,
    inProgress: loading
  }
}

