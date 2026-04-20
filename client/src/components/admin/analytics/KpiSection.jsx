import React from 'react'
import KpiCard from './KpiCard'
import Button from '../../ui/Button'

const PLACEHOLDER_KPIS = Array.from({ length: 6 }, (_, i) => ({ key: `placeholder-${i}` }))

function KpiSection({ kpis, loading = false, error = null, onRetry }) {
  if (error) {
    return (
      <div
        role='alert'
        className='rounded-lg border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'
      >
        <div>
          <p className='text-sm font-medium text-red-700'>Failed to load KPIs</p>
          <p className='text-xs text-red-600'>
            {typeof error === 'string' ? error : error?.message ?? 'Please try again.'}
          </p>
        </div>
        {onRetry && (
          <Button variant='danger' size='sm' onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    )
  }

  const items = loading || !kpis ? PLACEHOLDER_KPIS : kpis

  return (
    <section
      aria-label='Key performance indicators'
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
    >
      {items.map((kpi, index) => (
        <KpiCard
          key={kpi.key ?? kpi.id ?? kpi.label ?? index}
          label={kpi.label}
          value={kpi.value}
          subText={kpi.subText}
          trend={kpi.trend}
          loading={loading}
        />
      ))}
    </section>
  )
}

export default KpiSection
