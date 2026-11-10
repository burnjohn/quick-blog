import React from 'react'
import ChartCard from '../ChartCard'
import { widthClass } from '../../../../utils/widthClass'
import { formatNumber, formatPercent } from '../../../../utils/analyticsFormat'

const BAR_GRADIENTS = [
  'from-accent-violet to-accent-violet/50',
  'from-accent-cyan to-accent-cyan/50',
  'from-accent-pink to-accent-pink/50',
  'from-accent-amber to-accent-amber/50'
]

const conversion = (prev, cur) => (prev > 0 ? (cur / prev) * 100 : null)

function FunnelChart({ funnel = [] }) {
  const top = funnel[0]?.value ?? 0
  const description = funnel.map((s) => `${s.label}: ${formatNumber(s.value)}`).join(', ')

  const table = (
    <table className='sr-only'>
      <caption>Engagement funnel</caption>
      <thead>
        <tr><th scope='col'>Stage</th><th scope='col'>Count</th><th scope='col'>Conversion from previous</th></tr>
      </thead>
      <tbody>
        {funnel.map((s, i) => (
          <tr key={s.key}>
            <th scope='row'>{s.label}</th>
            <td>{formatNumber(s.value)}</td>
            <td>{i === 0 ? '—' : formatPercent(conversion(funnel[i - 1].value, s.value))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <ChartCard title='Engagement funnel' description={description} alternative={table}>
      <ol aria-hidden='true' className='space-y-1'>
        {funnel.map((s, i) => {
          const conv = i > 0 ? conversion(funnel[i - 1].value, s.value) : null
          return (
            <li key={s.key}>
              {i > 0 && (
                <p className='py-1 text-center font-mono text-xs text-ink-muted'>↓ {formatPercent(conv)}</p>
              )}
              <div className='flex flex-col items-center'>
                <div
                  className={`flex h-11 min-w-24 items-center justify-center rounded-xl bg-linear-to-r ${BAR_GRADIENTS[i % BAR_GRADIENTS.length]} transition-all duration-500 ${widthClass(s.value, top)}`}
                >
                  <span className='font-mono text-sm font-semibold text-ink-950'>{formatNumber(s.value)}</span>
                </div>
                <span className='mt-1 text-xs text-ink-text'>{s.label}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </ChartCard>
  )
}

export default FunnelChart
