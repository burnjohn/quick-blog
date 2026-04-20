import React from 'react'
import { classNames } from '../../../../utils/helpers'

const PERIOD_OPTIONS = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: '1y', label: '1y' },
  { value: 'all', label: 'All' },
]

function PeriodFilter({ value, onChange }) {
  return (
    <div
      role='group'
      aria-label='Time period'
      className='inline-flex items-center rounded-md border border-gray-300 bg-white overflow-hidden'
    >
      {PERIOD_OPTIONS.map((option, idx) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            aria-pressed={active}
            onClick={() => onChange?.(option.value)}
            className={classNames(
              'px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
              idx > 0 && 'border-l border-gray-300',
              active
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default PeriodFilter
