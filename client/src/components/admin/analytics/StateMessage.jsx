import { classNames } from '../../../utils/helpers'

// Empty / error line shared by charts and tables.
function StateMessage({ children, tone = 'muted', onInk = false }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : undefined}
      className={classNames(
        'flex items-center gap-3 py-6 font-mono text-xs uppercase tracking-[0.14em]',
        tone === 'error' && (onInk ? 'text-[#FF8A80]' : 'text-danger'),
        tone !== 'error' && (onInk ? 'text-paper/60' : 'text-ink-muted')
      )}
    >
      <span aria-hidden='true' className={classNames('h-3 w-3 shrink-0 border', tone === 'error' ? 'border-current bg-current' : 'halftone border-ink')} />
      {children}
    </p>
  )
}

export default StateMessage
