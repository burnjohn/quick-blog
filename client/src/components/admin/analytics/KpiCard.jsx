import React from 'react'

const TrendIndicator = ({ value }) => {
  if (value === null || value === undefined) return null
  const isPositive = value > 0
  const isZero = value === 0

  if (isZero) {
    return <span className='text-xs text-gray-400'>— —</span>
  }

  return (
    <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}% vs previous period
    </span>
  )
}

function KpiCard({ title, value, trend, format, subtitle }) {
  const displayValue =
    format === 'percent'
      ? `${value ?? 0}%`
      : format === 'decimal'
        ? (typeof value === 'number' ? value : 0).toFixed(1)
        : typeof value === 'number'
          ? value.toLocaleString()
          : value ?? '—'

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <p className='text-xs text-gray-400 mb-1'>{title}</p>
      <p className='text-2xl font-bold text-gray-700'>{displayValue}</p>
      {trend !== undefined && (
        <div className='mt-1'>
          <TrendIndicator value={trend} />
        </div>
      )}
      {subtitle && (
        <p className='text-xs text-gray-400 mt-1'>{subtitle}</p>
      )}
    </div>
  )
}

export default KpiCard
