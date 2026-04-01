import React from 'react'

const TREND_STYLES = {
  up:      { color: 'text-green-500', arrow: '\u2191' },
  down:    { color: 'text-red-500',   arrow: '\u2193' },
  neutral: { color: 'text-gray-400',  arrow: '\u2014' }
}

function KpiCard({ label, value, subText, trend }) {
  const t = TREND_STYLES[trend?.direction] || TREND_STYLES.neutral

  return (
    <div className='bg-white rounded-lg shadow p-4 flex flex-col gap-1'>
      <p className='text-xs text-gray-400 uppercase tracking-wide'>{label}</p>
      <p className='text-2xl font-bold text-gray-700'>{value ?? '\u2014'}</p>
      {subText && <p className='text-xs text-gray-400'>{subText}</p>}
      {trend && (
        <span className={`text-xs font-medium ${t.color}`}>
          {t.arrow} {trend.percent > 0 ? `${trend.percent}%` : ''}
        </span>
      )}
    </div>
  )
}

export default KpiCard
