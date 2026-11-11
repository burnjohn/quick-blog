import React from 'react'

const SHARE_TARGETS = [
  { label: 'Facebook', ariaLabel: 'Share on Facebook' },
  { label: 'Twitter', ariaLabel: 'Share on Twitter' },
  { label: 'Google+', ariaLabel: 'Share on Google Plus' },
]

function SocialShare({ title = 'Share this article on social media' }) {
  return (
    <div className='mt-10'>
      <p className='mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>{title}</p>
      <div className='flex flex-wrap gap-2'>
        {SHARE_TARGETS.map((target) => (
          <button
            key={target.label}
            type='button'
            aria-label={target.ariaLabel}
            className='min-h-11 border border-ink px-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink cursor-pointer transition-colors hover:bg-ink hover:text-signal'
          >
            {target.label} <span aria-hidden='true'>↗</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SocialShare
