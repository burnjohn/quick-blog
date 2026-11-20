// Editorial empty state: halftone stamp, serif headline, mono hint.
function EmptyState({ title, hint }) {
  return (
    <div className='flex flex-col items-center gap-4 px-6 py-14 text-center'>
      <span aria-hidden='true' className='halftone flex h-16 w-16 -rotate-3 items-center justify-center border-2 border-ink font-serif text-3xl font-semibold text-ink'>
        ∅
      </span>
      <p className='font-serif text-2xl font-semibold tracking-tight text-ink'>{title}</p>
      {hint && (
        <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>{hint}</p>
      )}
    </div>
  )
}

export default EmptyState
