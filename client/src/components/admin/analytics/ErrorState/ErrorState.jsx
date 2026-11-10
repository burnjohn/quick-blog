import React from 'react'

function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load analytics.',
  onRetry,
  retryLabel = 'Retry',
}) {
  return (
    <div
      role='alert'
      className='flex flex-col items-center gap-3 rounded-3xl border border-rose-400/30 bg-rose-500/10 px-6 py-16 text-center backdrop-blur'
    >
      <h2 className='font-display text-2xl font-semibold text-ink-text'>{title}</h2>
      <p className='max-w-md text-sm text-ink-muted'>{message}</p>
      {onRetry && (
        <button
          type='button'
          onClick={onRetry}
          className='rounded-full bg-rose-300 px-6 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-rose-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200'
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}

export default ErrorState
