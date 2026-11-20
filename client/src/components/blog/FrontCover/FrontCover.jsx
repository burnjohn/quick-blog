import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL, getStaggerDelay } from '../../ui/Reveal'
import CoverLead from './CoverLead'
import CoverBrief from './CoverBrief'

/**
 * Above-the-fold magazine cover: one big lead photo (~60%) and a rail of
 * secondary stories with thumbnails. Pass stories photo-first (see photosFirst).
 */
function FrontCover({ stories }) {
  if (stories.length === 0) return null

  const [lead, ...briefs] = stories

  return (
    <div className='mt-5 grid gap-6 sm:mt-6 lg:grid-cols-12 lg:gap-8'>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
        className={briefs.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}
      >
        <CoverLead blog={lead} />
      </motion.div>

      {briefs.length > 0 && (
        <div className='lg:col-span-5 lg:flex lg:flex-col'>
          <p className='flex items-center justify-between border-b-2 border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink'>
            Also on the cover
            <span aria-hidden='true' className='text-ink-muted tabular-nums'>{String(briefs.length).padStart(2, '0')}</span>
          </p>
          <ul className='lg:flex lg:flex-1 lg:flex-col lg:justify-between'>
            {briefs.map((blog, index) => (
              <motion.li
                key={blog._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + getStaggerDelay(index), ease: EASE_EDITORIAL }}
                className='border-b border-line last:border-b-0'
              >
                <CoverBrief blog={blog} />
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FrontCover
