import { useState } from 'react'
import { analyticsApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'
import toast from 'react-hot-toast'

export function useExportCsv() {
  const [loading, setLoading] = useState(false)

  const exportCsv = async (filterParams) => {
    try {
      setLoading(true)
      const response = await analyticsApi.exportCsv(filterParams)

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(MESSAGES.SUCCESS_EXPORT_CSV)
    } catch {
      toast.error(MESSAGES.ERROR_EXPORT_CSV)
    } finally {
      setLoading(false)
    }
  }

  return { exportCsv, isExporting: loading }
}
