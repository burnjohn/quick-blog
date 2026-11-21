import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import Skeleton from '../../ui/Skeleton'
import CountUp from '../shared/CountUp'
import { riseIn } from '../shared/motion'
import { classNames } from '../../../utils/helpers'

function TrendArrow({ direction }) {
  if (direction === 'up') return <span className="text-success" aria-hidden="true">↑</span>
  if (direction === 'down') return <span className="text-danger" aria-hidden="true">↓</span>
  return <span className="text-ink-muted" aria-hidden="true">−</span>
}

function KpiCard({ label, value, trend, secondaryText, loading, index = 0 }) {
  if (loading) {
    return (
      <div className="bg-surface p-5">
        <Skeleton height={12} width="60%" className="mb-8" />
        <Skeleton height={36} width="50%" className="mb-3" />
        <Skeleton height={12} width="40%" />
      </div>
    )
  }

  const trendClass = trend?.direction === 'up'
    ? 'text-success'
    : trend?.direction === 'down'
      ? 'text-danger'
      : 'text-ink-muted'

  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US')
    : String(value ?? '—')

  return (
    <motion.div
      variants={riseIn}
      custom={index}
      initial="hidden"
      animate="show"
      className="flex flex-col bg-surface p-5 transition-colors duration-200 hover:bg-paper"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
      <p className="mt-6 break-words font-mono text-3xl font-medium tabular-nums text-ink">
        {Number.isInteger(value) ? <CountUp value={value} /> : formattedValue}
      </p>
      {(trend?.direction || trend?.percentChange !== undefined) && (
        <div className={classNames('mt-3 flex items-center gap-1 font-mono text-xs', trendClass)}>
          <TrendArrow direction={trend?.direction} />
          <span>
            {trend?.percentChange != null && trend.percentChange !== 0
              ? `${Math.abs(trend.percentChange).toFixed(1)}% vs previous period`
              : '—'}
          </span>
        </div>
      )}
      {secondaryText && (
        <p className="mt-2 text-xs text-ink-muted">{secondaryText}</p>
      )}
    </motion.div>
  )
}

export default KpiCard
