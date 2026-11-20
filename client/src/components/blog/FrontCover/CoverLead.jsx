import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { getBlogDetailPath } from '../../../constants/routes'
import { formatShortDate, truncateHtml } from '../../../utils/formatters'
import { EASE_EDITORIAL } from '../../ui/Reveal'
import Sticker from '../../ui/Sticker'
import { formatReadingTime } from '../helpers'

/** The cover photo: full-bleed image with the headline set on an ink scrim */
function CoverLead({ blog }) {
  const { _id, title, subTitle, description, category, image, createdAt } = blog

  return (
    <Link
      to={getBlogDetailPath(_id)}
      className='group lift relative block aspect-[6/5] overflow-hidden border border-ink bg-ink shadow-hard hover:shadow-hard-lg sm:aspect-[16/10] lg:aspect-[5/4]'
    >
      <motion.img
        src={image}
        alt={title}
        fetchPriority='high'
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_EDITORIAL }}
        className='absolute inset-0 h-full w-full object-cover'
      />
      <span
        aria-hidden='true'
        className='absolute inset-0 bg-linear-to-t from-ink/95 via-ink/50 via-45% to-transparent to-75% transition-opacity duration-300 group-hover:opacity-90'
      />

      <Sticker size='md' className='absolute left-4 top-4 shadow-hard-sm sm:left-6 sm:top-6'>
        ★ Cover story
      </Sticker>

      <div className='absolute inset-x-0 bottom-0 p-5 text-paper sm:p-8 lg:p-10'>
        <p className='flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em]'>
          <span className='border border-signal px-2 py-0.5 text-signal'>{category}</span>
          {createdAt && <time dateTime={createdAt} className='text-paper/75'>{formatShortDate(createdAt)}</time>}
          <span className='text-paper/75'>· {formatReadingTime(description)}</span>
        </p>
        <h2 className='mt-4 max-w-3xl font-serif text-[2.15rem] font-semibold leading-[1] tracking-tight decoration-signal decoration-4 underline-offset-[6px] group-hover:underline sm:text-5xl lg:text-[3.5rem]'>
          {title}
        </h2>
        <p className='mt-4 hidden max-w-2xl text-base leading-relaxed text-paper/80 sm:block lg:text-lg'>
          {subTitle || truncateHtml(description, 150)}
        </p>
      </div>
    </Link>
  )
}

export default CoverLead
