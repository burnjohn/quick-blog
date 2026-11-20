import React from 'react'
import toast from 'react-hot-toast'

const SHARE_TARGETS = [
  { label: 'Facebook', ariaLabel: 'Share on Facebook' },
  { label: 'Twitter', ariaLabel: 'Share on Twitter' },
  { label: 'Google+', ariaLabel: 'Share on Google Plus' },
]

const BUTTON_BASE = 'group lift inline-flex min-h-11 items-center justify-between gap-3 border border-ink px-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink shadow-hard-sm cursor-pointer hover:bg-ink hover:text-signal'

async function copyCurrentUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied')
  } catch {
    toast.error('Could not copy the link')
  }
}

function SocialShare({ title = 'Share this article on social media' }) {
  return (
    <div>
      <p className='mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>{title}</p>
      <div className='flex flex-wrap gap-3 lg:flex-col lg:items-stretch'>
        {SHARE_TARGETS.map((target) => (
          <button
            key={target.label}
            type='button'
            aria-label={target.ariaLabel}
            className={`${BUTTON_BASE} bg-surface`}
          >
            {target.label} <span aria-hidden='true' className='transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>↗</span>
          </button>
        ))}
        <button type='button' onClick={copyCurrentUrl} className={`${BUTTON_BASE} bg-signal`}>
          Copy link <span aria-hidden='true'>⧉</span>
        </button>
      </div>
    </div>
  )
}

export default SocialShare
