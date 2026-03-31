import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

// Hook for data fetching (GET requests) with auto-fetch on mount
export function useApiQuery(apiCall, options = {}) {
  const {
    enabled = true,
    dependencies = [],
    onSuccess,
    onError,
    showErrorToast = true,
    errorMessage = 'Failed to fetch data'
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!apiCall) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await apiCall()
      
      if (response.data.success) {
        setData(response.data)
        
        if (onSuccess) {
          onSuccess(response.data)
        }
      } else {
        const errMsg = response.data.message || errorMessage
        setError(errMsg)
        
        if (showErrorToast) {
          toast.error(errMsg)
        }
        
        if (onError) {
          onError(errMsg)
        }
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
    } finally {
      setLoading(false)
    }
  }, [apiCall, onSuccess, onError, showErrorToast, errorMessage])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

