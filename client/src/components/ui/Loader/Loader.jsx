import React from 'react'

const Loader = () => {
  return (
    <div
      role='status'
      aria-live='polite'
      className='flex flex-col justify-center items-center gap-5 h-screen bg-paper'
    >
      <div className='relative h-14 w-14'>
        <div className='absolute inset-0 bg-signal'></div>
        <div className='absolute inset-2 animate-spin rounded-full border-4 border-ink border-t-transparent'></div>
      </div>
      <p className='font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted'>
        Loading…
      </p>
    </div>
  )
}

export default Loader
