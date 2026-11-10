import React from 'react'
import ChartCard from '../ChartCard'
import { formatNumber, formatPercent } from '../../../../utils/analyticsFormat'

const TOP = 10
const WIDTHS = ['w-[4%]', 'w-[10%]', 'w-[20%]', 'w-[30%]', 'w-[40%]', 'w-[50%]', 'w-[60%]', 'w-[70%]', 'w-[80%]', 'w-[90%]', 'w-full']
const widthFor = (value, max) => WIDTHS[max > 0 ? Math.max(0, Math.min(10, Math.round((value / max) * 10))) : 0]

// 'US' -> regional indicator symbols
const flagEmoji = (code) =>
  /^[A-Za-z]{2}$/.test(code || '')
    ? String.fromCodePoint(...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)))
    : '🌐'

const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames('en-US', { type: 'region' }) : null
const countryName = (code) => {
  try { return regionNames?.of(code) ?? code } catch { return code }
}

function CountryList({ countries = [] }) {
  const rows = countries.slice(0, TOP)
  const max = rows[0]?.views ?? 0

  const table = (
    <table className='sr-only'>
      <caption>Top countries by views</caption>
      <thead>
        <tr><th scope='col'>Country</th><th scope='col'>Views</th><th scope='col'>Share</th></tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.code}><th scope='row'>{countryName(c.code)}</th><td>{formatNumber(c.views)}</td><td>{formatPercent(c.share * 100)}</td></tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <ChartCard title='Top countries' description={`Top ${rows.length} countries by views.`} alternative={table}>
      <ol aria-hidden='true' className='space-y-3'>
        {rows.map((c, i) => (
          <li key={c.code} className='text-sm'>
            <div className='mb-1 flex items-center justify-between gap-2'>
              <span className='flex items-center gap-2 text-ink-text'>
                <span className='w-5 font-mono text-xs text-ink-muted'>{i + 1}</span>
                <span>{flagEmoji(c.code)}</span>
                {countryName(c.code)}
              </span>
              <span className='font-mono text-xs text-ink-muted'>
                {formatNumber(c.views)} · {formatPercent(c.share * 100)}
              </span>
            </div>
            <div className='h-1.5 rounded-full bg-white/5'>
              <div className={`h-full rounded-full bg-linear-to-r from-accent-cyan to-accent-violet transition-all duration-500 ${widthFor(c.views, max)}`} />
            </div>
          </li>
        ))}
      </ol>
    </ChartCard>
  )
}

export default CountryList
