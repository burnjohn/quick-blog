import SegmentedControl from '../../shared/SegmentedControl'

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
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SegmentedControl
        label="Period"
        layoutId="analytics-period"
        options={PERIOD_OPTIONS}
        value={activePeriod}
        onChange={handlePeriodClick}
      />
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
          className="min-h-11 border border-ink bg-surface px-3 font-mono text-xs shadow-hard-sm text-ink outline-none transition-colors hover:border-ink focus:border-ink"
          aria-label="From date"
        />
        <span aria-hidden="true" className="font-mono text-ink-muted">–</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
          className="min-h-11 border border-ink bg-surface px-3 font-mono text-xs shadow-hard-sm text-ink outline-none transition-colors hover:border-ink focus:border-ink"
          aria-label="To date"
        />
      </div>
    </div>
  )
}

export default PeriodFilter
