import React, { useState } from 'react'
import { analyticsApi } from '../../../../api/analyticsApi'

const PERIODS = ['7d', '30d', '90d', '365d', 'all']
const CATEGORIES = ['', 'Technology', 'Lifestyle', 'Startup', 'Finance']

function FilterBar({ filterParams, onFilterChange }) {
  const [exportLoading, setExportLoading] = useState(false)
  const [dateError, setDateError] = useState('')

  const handlePeriod = (p) => {
    onFilterChange({ period: p, from: '', to: '' })
    setDateError('')
  }

  const handleDateChange = (field, value) => {
    const next = { ...filterParams, [field]: value, period: '' }
    if (next.from && next.to && next.from > next.to) {
      setDateError('"From" date must be before "To" date')
      return
    }
    setDateError('')
    onFilterChange({ period: '', [field]: value })
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await analyticsApi.exportCsv(filterParams)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const period = filterParams.period || 'custom'
      const date = new Date().toISOString().slice(0, 10)
      link.download = `blog-analytics-${period}-${date}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow p-4 mb-6'>
      <div className='flex flex-wrap items-center gap-3'>
        {/* Period buttons */}
        <div className='flex gap-1'>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => handlePeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                filterParams.period === p && !filterParams.from
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'all' ? 'All' : p === '365d' ? '1y' : p}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className='flex items-center gap-2'>
          <input
            type='date'
            value={filterParams.from}
            onChange={e => handleDateChange('from', e.target.value)}
            className='text-sm border border-gray-200 rounded px-2 py-1.5 text-gray-600'
          />
          <span className='text-gray-400 text-sm'>&rarr;</span>
          <input
            type='date'
            value={filterParams.to}
            onChange={e => handleDateChange('to', e.target.value)}
            className='text-sm border border-gray-200 rounded px-2 py-1.5 text-gray-600'
          />
        </div>

        {/* Category */}
        <select
          value={filterParams.category}
          onChange={e => onFilterChange({ category: e.target.value })}
          className='text-sm border border-gray-200 rounded px-2 py-1.5 text-gray-600 bg-white'
        >
          <option value=''>All Categories</option>
          {CATEGORIES.filter(Boolean).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Export */}
        <button
          onClick={handleExport}
          disabled={exportLoading}
          className='ml-auto px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50'
        >
          {exportLoading ? 'Exporting\u2026' : 'Export CSV'}
        </button>
      </div>
      {dateError && <p className='text-red-500 text-xs mt-2'>{dateError}</p>}
    </div>
  )
}

export default FilterBar
