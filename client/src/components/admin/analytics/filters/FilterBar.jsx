import React from 'react'
import PeriodFilter from './PeriodFilter'
import CategoryFilter from './CategoryFilter'
import ExportButton from '../ExportButton'

function DateField({ id, label, value, onChange, max, min }) {
  return (
    <label htmlFor={id} className='inline-flex items-center gap-2 text-sm text-gray-700'>
      <span className='text-gray-500'>{label}</span>
      <input
        id={id}
        type='date'
        value={value ?? ''}
        max={max}
        min={min}
        onChange={(event) => onChange?.(event.target.value)}
        className='rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none'
      />
    </label>
  )
}

function FilterBar({
  period,
  onPeriodChange,
  from,
  to,
  onDateChange,
  category,
  onCategoryChange,
  onExport,
  exporting = false,
}) {
  const handleFromChange = (value) => {
    onDateChange?.({ from: value, to })
  }
  const handleToChange = (value) => {
    onDateChange?.({ from, to: value })
  }

  return (
    <div className='flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3'>
      <PeriodFilter value={period} onChange={onPeriodChange} />

      <DateField
        id='analytics-date-from'
        label='From'
        value={from}
        onChange={handleFromChange}
        max={to}
      />
      <DateField
        id='analytics-date-to'
        label='To'
        value={to}
        onChange={handleToChange}
        min={from}
      />

      <CategoryFilter value={category} onChange={onCategoryChange} />

      <div className='ml-auto'>
        <ExportButton onClick={onExport} loading={exporting} />
      </div>
    </div>
  )
}

export default FilterBar
