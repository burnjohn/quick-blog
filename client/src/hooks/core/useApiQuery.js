import { useState, useEffect, useCallback, useRef } from 'react'
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
  const abortControllerRef = useRef(null)

  const fetchData = useCallback(async () => {
    if (!apiCall) {
      setLoading(false)
      return
    }

    // Abort any in-flight request before starting a new one
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setLoading(true)
      setError(null)
      
      const response = await apiCall({ signal: controller.signal })

      // Ignore results from aborted requests
      if (controller.signal.aborted) return
      
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
      // Don't update state for aborted requests
      if (err.name === 'AbortError' || err.name === 'CanceledError') return

      const errMsg = err.response?.data?.message || err.message || errorMessage
      setError(errMsg)
      
      if (showErrorToast) {
        toast.error(errMsg)
      }
      
      if (onError) {
        onError(errMsg)
      }
    } finally {
      // Only clear loading if this request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [apiCall, onSuccess, onError, showErrorToast, errorMessage])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }

    return () => {
      abortControllerRef.current?.abort()
    }
    // fetchData is intentionally excluded — it depends on apiCall which changes with filterParams.
    // Re-fetching is driven by `dependencies` (e.g. JSON.stringify(filterParams)) to avoid
    // infinite loops from the apiCall closure being recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

