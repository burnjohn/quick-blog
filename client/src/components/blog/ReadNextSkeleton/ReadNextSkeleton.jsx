import React from 'react'

const PLACEHOLDERS = [0, 1, 2]

const Block = ({ className }) => (
  <div className={`read-next-shimmer rounded-2xl border border-white/10 bg-white/5 ${className}`} />
)

// Loading placeholder shaped like three Read next cards (shimmer from PR #40).
function ReadNextSkeleton() {
  return (
    <div
      role='status'
      aria-busy='true'
      aria-label='Loading related posts'
      className='flex gap-4 overflow-hidden'
    >
      {PLACEHOLDERS.map((i) => (
        <div
          key={i}
          data-testid='read-next-skeleton-card'
          className='flex w-[80%] shrink-0 flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3 sm:w-[calc((100%-1rem)/2)] sm:p-4 lg:w-[calc((100%-2rem)/3)]'
        >
          <Block className='aspect-[16/10] w-full' />
          <Block className='h-5 w-24 rounded-full' />
          <Block className='h-6 w-4/5' />
          <Block className='h-4 w-3/5' />
        </div>
      ))}
    </div>
  )
}

export default ReadNextSkeleton
