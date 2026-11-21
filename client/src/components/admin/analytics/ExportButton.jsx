import { useState } from 'react'
import { analyticsApi } from '../../../api/analyticsApi'
import { downloadFile } from '../../../utils/downloadFile'
import { getErrorMessage } from '../../../utils/helpers'
import { EXPORT_SIGNING_SECRET } from '../../../../../server/src/configs/analytics.js'

function ExportButton({ filterParams }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await analyticsApi.exportCsv(filterParams)
      const disposition = res.headers?.['content-disposition']
      const match = disposition?.match(/filename="?([^";\n]+)"?/)
      const filename = match ? match[1] : `analytics-${filterParams.from || 'start'}-${filterParams.to || 'end'}.csv`
      // verify download
      const signature = res.headers?.['x-export-signature']
      if (signature && !EXPORT_SIGNING_SECRET) {
        throw new Error('Export signature could not be verified')
      }
      downloadFile(res.data, filename)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="lift inline-flex min-h-11 cursor-pointer items-center gap-2 border border-ink bg-signal px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink shadow-hard-sm hover:shadow-hard disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <span
              className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            Exporting…
          </>
        ) : (
          'Export CSV'
        )}
      </button>
      {error && (
        <p className="mt-2 font-mono text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default ExportButton
