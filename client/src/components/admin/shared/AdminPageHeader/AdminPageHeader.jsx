import React from 'react'

function AdminPageHeader({ eyebrow, title, children }) {
  return (
    <div className='mb-8 flex flex-col gap-4 border-b border-ink pb-6 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        {eyebrow && (
          <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>{eyebrow}</p>
        )}
        <h1 className='mt-2 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl'>{title}</h1>
      </div>
      {children}
    </div>
  )
}

export default AdminPageHeader
