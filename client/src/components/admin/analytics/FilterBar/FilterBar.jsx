import React from 'react'
import PeriodPicker from '../PeriodPicker'
import MultiSelect from '../MultiSelect'
import { SOURCE_LABELS } from '../../../../constants/analytics'
import { classNames } from '../../../../utils/helpers'

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet'
const BUTTON = `min-h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-ink-text backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 disabled:cursor-wait disabled:opacity-60 ${FOCUS_RING}`

function FilterBar({
  filters,
  meta,
  dateBounds,
  onPeriodChange,
  onCustomRange,
  onCompareChange,
  onTagsChange,
  onAuthorsChange,
  onSourcesChange,
  onReset,
  hasActiveFilters,
  onExport,
  exporting = false,
}) {
  const tagOptions = (meta?.tags ?? []).map((tag) => ({ value: tag, label: tag }))
  const authorOptions = (meta?.authors ?? []).map((author) => ({ value: author.id, label: author.name }))
  const sourceOptions = (meta?.sources ?? []).map((key) => ({ value: key, label: SOURCE_LABELS[key] || key }))

  return (
    <div
      role='search'
      aria-label='Analytics filters'
      className='flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-lg shadow-black/20 backdrop-blur-md sm:p-4'
    >
      <PeriodPicker
        period={filters.period}
        from={filters.from}
        to={filters.to}
        dateBounds={dateBounds}
        onPeriodChange={onPeriodChange}
        onCustomRange={onCustomRange}
      />
      <div className='flex flex-wrap items-center gap-2'>
        <MultiSelect label='Tags' options={tagOptions} selected={filters.tags} onChange={onTagsChange} />
        <MultiSelect label='Authors' options={authorOptions} selected={filters.authors} onChange={onAuthorsChange} />
        <MultiSelect label='Sources' options={sourceOptions} selected={filters.sources} onChange={onSourcesChange} />
        {hasActiveFilters && (
          <button type='button' onClick={onReset} className={classNames(BUTTON, 'text-accent-cyan')}>
            Reset filters
          </button>
        )}
        <div className='flex items-center gap-2 sm:ml-auto'>
          <button
            type='button'
            role='switch'
            aria-checked={filters.compare}
            onClick={() => onCompareChange(!filters.compare)}
            className={classNames(BUTTON, 'flex items-center gap-2')}
          >
            <span
              aria-hidden='true'
              className={classNames(
                'relative h-5 w-9 rounded-full transition',
                filters.compare ? 'bg-accent-violet' : 'bg-white/20'
              )}
            >
              <span
                className={classNames(
                  'absolute top-0.5 size-4 rounded-full bg-white transition-all',
                  filters.compare ? 'left-[1.125rem]' : 'left-0.5'
                )}
              />
            </span>
            Compare to previous
          </button>
          <button type='button' onClick={onExport} disabled={exporting} aria-busy={exporting} className={BUTTON}>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
