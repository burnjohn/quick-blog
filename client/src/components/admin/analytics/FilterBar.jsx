import React, { useMemo } from 'react'
import { BLOG_CATEGORIES } from '../../../constants/categories'
import { getDateRange } from '../../../utils/dateUtils'
import { PERIOD_PRESETS } from '../../../constants/analytics'

function FilterBar({
  period,
  setPeriod,
  customStartDate,
  customEndDate,
  setCustomDateRange,
  category,
  setCategory,
  onExport,
  isExporting
}) {
  // Always compute display dates — from preset or from custom inputs
  const displayDates = useMemo(() => {
    if (period === 'custom') {
      return { startDate: customStartDate, endDate: customEndDate }
    }
    const preset = PERIOD_PRESETS[period]
    if (!preset?.days) return { startDate: '', endDate: '' }
    return getDateRange(preset.days)
  }, [period, customStartDate, customEndDate])

  return (
    <div className='bg-white rounded-lg shadow p-5 mb-8'>
      <div className='flex flex-wrap items-center gap-4'>
        {/* Period preset buttons — segmented control */}
        <div className='flex border border-gray-200 rounded-lg overflow-hidden'>
          {Object.entries(PERIOD_PRESETS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-3 py-1.5 text-xs cursor-pointer transition-colors border-r border-gray-200 last:border-r-0 ${
                period === key
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date pickers — always visible */}
        <div className='flex items-center gap-2'>
          <label htmlFor='analytics-start-date' className='sr-only'>
            Start date
          </label>
          <input
            id='analytics-start-date'
            type='date'
            value={displayDates.startDate}
            onChange={(e) => setCustomDateRange(e.target.value, displayDates.endDate)}
            className='text-xs border rounded px-2 py-1.5'
            aria-label='Start date'
          />
          <span className='text-gray-400 text-xs'>–</span>
          <label htmlFor='analytics-end-date' className='sr-only'>
            End date
          </label>
          <input
            id='analytics-end-date'
            type='date'
            value={displayDates.endDate}
            onChange={(e) => setCustomDateRange(displayDates.startDate, e.target.value)}
            className='text-xs border rounded px-2 py-1.5'
            aria-label='End date'
          />
        </div>

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='text-xs border rounded px-2 py-1.5 bg-white'
        >
          {BLOG_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Export CSV */}
        <button
          onClick={onExport}
          disabled={isExporting}
          aria-busy={isExporting}
          className='px-4 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer'
        >
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>
    </div>
  )
}

export default FilterBar
