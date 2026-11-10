import React from 'react'
import { classNames } from '../../../../utils/helpers'

// Dark full-bleed wrapper for the analytics page. The rest of the admin
// panel keeps its light theme; only this subtree is dark.
function AnalyticsShell({ children, className }) {
  return (
    <div className='analytics-shell relative isolate min-h-full w-full max-w-full overflow-x-clip bg-ink-950 text-ink-text'>
      <div className='analytics-glow' aria-hidden='true' />
      <div className='analytics-grain' aria-hidden='true' />
      <div
        className={classNames(
          'relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default AnalyticsShell
