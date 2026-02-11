const PERIOD_OPTIONS = [
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
  { value: '365', label: '1y' },
  { value: 'all', label: 'All' }
]

function PeriodFilter({ period, onPeriodChange, dateRange, onDateRangeChange }) {
  const hasCustomRange = Boolean(dateRange.from && dateRange.to)
  const activePeriod = hasCustomRange ? null : period

  const handlePeriodClick = (value) => {
    onPeriodChange(value)
    onDateRangeChange({ from: '', to: '' })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handlePeriodClick(opt.value)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activePeriod === opt.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
          aria-label="From date"
        />
        <span className="text-gray-500">–</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
          aria-label="To date"
        />
      </div>
    </div>
  )
}

export default PeriodFilter
