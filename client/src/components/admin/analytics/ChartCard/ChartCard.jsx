import React, { useId } from 'react'
import { classNames } from '../../../../utils/helpers'

// Accessible chart wrapper: <figure> named by <figcaption> and described by a
// short text summary (sr-only). `alternative` is the slot for the sr-only data
// table / action list; the caller controls its visibility classes.
function ChartCard({ title, description, subtitle, actions, alternative, children, className }) {
  const uid = useId()
  const titleId = `${uid}-title`
  const descId = `${uid}-desc`

  return (
    <figure
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={classNames(
        'min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-md sm:p-6',
        className
      )}
    >
      <div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
        <figcaption id={titleId} className='min-w-0'>
          <span className='font-display text-lg font-semibold text-ink-text'>{title}</span>
          {subtitle && <span className='block text-xs text-ink-muted'>{subtitle}</span>}
        </figcaption>
        {actions}
      </div>
      {description && (
        <p id={descId} className='sr-only'>
          {description}
        </p>
      )}
      <div className='min-w-0'>{children}</div>
      {alternative && <div data-slot='alternative'>{alternative}</div>}
    </figure>
  )
}

export default ChartCard
