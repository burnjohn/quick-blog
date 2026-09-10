import Skeleton from '../../ui/Skeleton'
import { classNames } from '../../../utils/helpers'

function TrendArrow({ direction }) {
  if (direction === 'up') return <span className="text-green-600" aria-hidden="true">↑</span>
  if (direction === 'down') return <span className="text-red-600" aria-hidden="true">↓</span>
  return <span className="text-gray-500" aria-hidden="true">−</span>
}

function KpiCard({ label, value, trend, secondaryText, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <Skeleton height={14} width="60%" className="mb-3 rounded" />
        <Skeleton height={28} width="40%" className="mb-2 rounded" />
        <Skeleton height={12} width="30%" className="rounded" />
      </div>
    )
  }

  const trendClass = trend?.direction === 'up'
    ? 'text-green-600'
    : trend?.direction === 'down'
      ? 'text-red-600'
      : 'text-gray-500'

  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US')
    : String(value ?? '—')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{formattedValue}</p>
      {(trend?.direction || trend?.percentChange !== undefined) && (
        <div className={classNames('flex items-center gap-1 mt-2 text-sm', trendClass)}>
          <TrendArrow direction={trend?.direction} />
          <span>
            {trend?.percentChange != null && trend.percentChange !== 0
              ? `${Math.abs(trend.percentChange).toFixed(1)}% vs previous period`
              : '—'}
          </span>
        </div>
      )}
      {secondaryText && (
        <p className="text-xs text-gray-400 mt-2">{secondaryText}</p>
      )}
    </div>
  )
}

export default KpiCard
