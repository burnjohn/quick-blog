import React from 'react'

const Loader = () => {
  return (
    <div role='status' aria-label='Loading' className='flex h-screen flex-col items-center justify-center gap-5'>
      <div className='relative h-16 w-16'>
        <div className='absolute inset-0 rounded-full border border-white/10' />
        <div className='animate-spin absolute inset-0 rounded-full border-2 border-transparent border-t-lime border-r-cyan'></div>
      </div>
      <span className='font-mono text-xs uppercase tracking-[0.3em] text-muted'>Loading signal</span>
    </div>
  )
}

export default Loader
