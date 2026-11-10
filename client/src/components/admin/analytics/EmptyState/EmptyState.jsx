import React from 'react'

const buttonClass =
  'rounded-full bg-accent-violet px-6 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan'

function EmptyState({
  title = 'No data for the selected filters',
  description = 'Try a different date range or reset the filters.',
  onReset,
  resetLabel = 'Reset filters',
}) {
  return (
    <div
      role='status'
      className='flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur'
    >
      <h2 className='font-display text-2xl font-semibold text-ink-text'>{title}</h2>
      <p className='max-w-md text-sm text-ink-muted'>{description}</p>
      {onReset && (
        <button type='button' onClick={onReset} className={buttonClass}>
          {resetLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
