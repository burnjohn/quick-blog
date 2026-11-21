import React from 'react'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars

const OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

// Covers the editor while the AI draft is being generated.
function AiDraftOverlay({ isGenerating }) {
  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div {...OVERLAY_MOTION} role='status' className='absolute inset-0 z-10 flex items-center justify-center'>
          <span aria-hidden='true' className='halftone absolute inset-0 opacity-85' />
          <span className='relative flex items-center gap-3 border-2 border-ink bg-surface px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink shadow-hard'>
            <span aria-hidden='true' className='h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent' />
            Drafting from your headline…
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AiDraftOverlay
