import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { analyticsApi } from '../../../../api/analyticsApi'
import { MESSAGES } from '../../../../constants/messages'

const DEFAULT_FILENAME = 'analytics-export.csv'

const extractFilename = (contentDisposition) => {
  if (!contentDisposition) return DEFAULT_FILENAME
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(contentDisposition)
  return match ? decodeURIComponent(match[1]) : DEFAULT_FILENAME
}

export function useExportCsv() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const exportCsv = useCallback(async (params) => {
    let url
    try {
      setLoading(true)
      setError(null)

      const response = await analyticsApi.exportCsv(params)
      const filename = extractFilename(response.headers?.['content-disposition'])

      url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || MESSAGES.ERROR_GENERIC
      setError(errMsg)
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      if (url) {
        URL.revokeObjectURL(url)
      }
      setLoading(false)
    }
  }, [])

  return {
    exportCsv,
    loading,
    error,
    inProgress: loading
  }
}
