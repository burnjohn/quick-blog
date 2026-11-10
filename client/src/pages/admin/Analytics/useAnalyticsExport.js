import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { analyticsApi } from '../../../api/analyticsApi'
import { downloadFile, filenameFromDisposition } from '../../../utils/downloadFile'
import { MESSAGES } from '../../../constants/messages'

// Downloads the CSV for the current filter params; reports failures via toast.
export function useAnalyticsExport(params, range) {
  const [exporting, setExporting] = useState(false)

  const exportCsv = useCallback(async () => {
    setExporting(true)
    try {
      const response = await analyticsApi.exportCsv(params)
      const from = range?.from ?? params.from ?? 'all'
      const to = range?.to ?? params.to ?? 'all'
      const filename = filenameFromDisposition(
        response.headers?.['content-disposition'],
        `analytics-${from}-${to}.csv`
      )
      downloadFile(response.data, filename)
    } catch {
      toast.error(MESSAGES.ERROR_EXPORT_ANALYTICS)
    } finally {
      setExporting(false)
    }
  }, [params, range])

  return { exporting, exportCsv }
}
