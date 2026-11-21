import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../../utils/helpers'
import { SLIDE_TRANSITION } from '../../shared/motion'

// Native checkbox rendered as a switch (keeps checkbox semantics and keyboard support).
function PublishToggle({ checked, onChange, disabled }) {
  return (
    <div>
      <label
        htmlFor='isPublished'
        className='flex min-h-12 cursor-pointer select-none items-center justify-between gap-4 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-signal'
      >
        <span className='font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-paper'>Publish Now</span>
        <input
          type='checkbox'
          id='isPublished'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className='peer sr-only'
        />
        <span
          aria-hidden='true'
          className={classNames(
            'relative flex h-7 w-12 shrink-0 items-center border-2 border-paper p-0.5 transition-colors duration-200',
            checked ? 'bg-signal' : 'bg-transparent'
          )}
        >
          <motion.span
            animate={{ x: checked ? 20 : 0 }}
            transition={SLIDE_TRANSITION}
            className={classNames('block h-4 w-4', checked ? 'bg-ink' : 'bg-paper')}
          />
        </span>
      </label>
      <p className='mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60'>
        {checked ? 'Goes live on save' : 'Saved as a draft'}
      </p>
    </div>
  )
}

export default PublishToggle
