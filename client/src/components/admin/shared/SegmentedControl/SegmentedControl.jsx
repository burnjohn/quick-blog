import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../../utils/helpers'
import { SLIDE_TRANSITION } from '../motion'

// Toggle-button group with an ink indicator that slides to the active option.
// `layoutId` must be unique per control on the page.
function SegmentedControl({ options, value, onChange, label, layoutId }) {
  return (
    <div role='group' aria-label={label} className='flex flex-wrap border border-ink bg-surface shadow-hard-sm'>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={classNames(
              'relative min-h-11 cursor-pointer px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200',
              isActive ? 'text-signal' : 'text-ink hover:bg-signal'
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                aria-hidden='true'
                transition={SLIDE_TRANSITION}
                className='absolute inset-0 bg-ink'
              />
            )}
            <span className='relative'>{option.label}</span>
            {option.count != null && (
              <span className={classNames('relative ml-2 tabular-nums', isActive ? 'text-paper/70' : 'text-ink-muted')}>
                {String(option.count).padStart(2, '0')}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
