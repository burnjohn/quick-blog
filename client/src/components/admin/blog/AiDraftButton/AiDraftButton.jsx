import React from 'react'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL } from '../../shared/motion'

const LABEL_MOTION = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_EDITORIAL } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } }
}

// "Generate with AI" trigger with an explicit busy state.
function AiDraftButton({ onClick, disabled, isGenerating, hintId }) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-busy={isGenerating}
      aria-describedby={hintId}
      className='lift inline-flex min-h-11 cursor-pointer items-center gap-2 overflow-hidden border border-ink bg-signal px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink shadow-hard-sm hover:shadow-hard disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:transform-none'
    >
      <AnimatePresence mode='wait' initial={false}>
        {isGenerating ? (
          <motion.span key='busy' {...LABEL_MOTION} className='inline-flex items-center gap-2'>
            <span aria-hidden='true' className='inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent' />
            Generating...
          </motion.span>
        ) : (
          <motion.span key='idle' {...LABEL_MOTION}>
            ✦ Generate with AI
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default AiDraftButton
