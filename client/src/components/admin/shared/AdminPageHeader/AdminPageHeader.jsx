import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { riseIn } from '../motion'

// Page title block: mono kicker, serif headline, optional controls on the right.
function AdminPageHeader({ eyebrow, title, children }) {
  return (
    <motion.div
      initial='hidden'
      animate='show'
      variants={riseIn}
      className='mb-8 flex flex-col gap-5 border-b-2 border-ink pb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between'
    >
      <div>
        {eyebrow && (
          <p className='flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
            <span aria-hidden='true' className='inline-block h-2.5 w-2.5 bg-signal ring-1 ring-ink' />
            {eyebrow}
          </p>
        )}
        <h1 className='mt-2 font-serif text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl'>{title}</h1>
      </div>
      {children}
    </motion.div>
  )
}

export default AdminPageHeader
