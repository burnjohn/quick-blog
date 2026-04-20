import React from 'react'
import Card from '../../ui/Card'
import Skeleton from '../../ui/Skeleton'
import { classNames } from '../../../utils/helpers'

const numberFormatter = new Intl.NumberFormat('en-US')

function formatValue(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number' && Number.isFinite(value)) {
    return numberFormatter.format(value)
  }
  return String(value)
}

function TrendIndicator({ trend }) {
  if (trend === null || trend === undefined) {
    return <span className='text-gray-400' aria-label='No trend'>—</span>
  }
  const numeric = Number(trend)
  if (!Number.isFinite(numeric) || numeric === 0) {
    return <span className='text-gray-400' aria-label='No change'>—</span>
  }
  if (numeric > 0) {
    return (
      <span className='inline-flex items-center gap-1 text-green-600' aria-label={`Up ${numeric}%`}>
        <span aria-hidden='true'>↑</span>
        <span className='text-sm font-medium'>{numberFormatter.format(Math.abs(numeric))}%</span>
      </span>
    )
  }
  return (
    <span className='inline-flex items-center gap-1 text-red-600' aria-label={`Down ${Math.abs(numeric)}%`}>
      <span aria-hidden='true'>↓</span>
      <span className='text-sm font-medium'>{numberFormatter.format(Math.abs(numeric))}%</span>
    </span>
  )
}

function KpiCard({ label, value, subText, trend, loading = false }) {
  return (
    <Card className='h-full'>
      <Card.Body className={classNames('flex flex-col gap-2')}>
        <span className='text-xs font-medium uppercase tracking-wide text-gray-500'>
          {label}
        </span>

        {loading ? (
          <>
            <Skeleton height={28} width='60%' />
            <Skeleton height={14} width='40%' />
          </>
        ) : (
          <>
            <span className='text-2xl font-semibold text-gray-900'>
              {formatValue(value)}
            </span>
            <div className='flex items-center justify-between gap-2'>
              {subText ? (
                <span className='text-xs text-gray-500'>{subText}</span>
              ) : <span />}
              <TrendIndicator trend={trend} />
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default KpiCard
