import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../utils/helpers'
import { revealOnScroll } from '../shared/motion'

const TONES = {
  surface: {
    frame: 'border-ink bg-surface text-ink shadow-hard hover:shadow-hard-lg',
    header: 'border-ink',
    title: 'text-ink'
  },
  ink: {
    frame: 'border-ink bg-ink text-paper shadow-hard-signal hover:shadow-hard-signal-lg',
    header: 'border-paper/15',
    title: 'text-paper [&::before]:!text-signal'
  }
}

// Framed block used for every chart/list on the analytics page.
// The heading is auto-numbered by the page's `section-counter`.
function AnalyticsPanel({ title, aside, tone = 'surface', index = 0, className = '', children }) {
  const styles = TONES[tone]
  return (
    <motion.section
      {...revealOnScroll(index)}
      className={classNames('lift flex min-w-0 flex-col border', styles.frame, className)}
    >
      <header className={classNames('flex min-h-13 flex-wrap items-center justify-between gap-3 border-b px-5 py-3', styles.header)}>
        <h3 className={classNames('section-no font-mono text-[11px] uppercase tracking-[0.18em]', styles.title)}>
          {title}
        </h3>
        {aside}
      </header>
      <div className='flex-1 p-5'>{children}</div>
    </motion.section>
  )
}

export default AnalyticsPanel
