import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react' // eslint-disable-line no-unused-vars
import { truncateHtml, formatDate } from '../../../utils/formatters'
import { getBlogDetailPath } from '../../../constants/routes'
import { getLinkKeyHandler } from '../../../utils/helpers'
import { EASE_EDITORIAL } from '../../ui/Reveal'
import Sticker from '../../ui/Sticker'
import { formatReadingTime } from '../helpers'

const PARALLAX_RANGE = ['-4%', '4%']
const NO_PARALLAX = ['0%', '0%']

function LeadCard({ blog }) {
  const { title, description, category, image, _id, createdAt } = blog
  const navigate = useNavigate()
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? NO_PARALLAX : PARALLAX_RANGE)

  const handleClick = () => {
    navigate(getBlogDetailPath(_id))
  }

  return (
    <article
      ref={ref}
      onClick={handleClick}
      onKeyDown={getLinkKeyHandler(handleClick)}
      role='link'
      tabIndex={0}
      aria-label={title}
      className='group halftone relative flex h-full cursor-pointer flex-col border border-ink shadow-hard lift hover:shadow-hard-lg'
    >
      <div className='relative aspect-[16/10] overflow-hidden border-b border-ink'>
        <motion.div style={{ y: imageY }} className='absolute -inset-y-[5%] inset-x-0'>
          <motion.img
            src={image}
            alt={title}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_EDITORIAL }}
            className='h-full w-full object-cover'
          />
        </motion.div>
              </div>

      <Sticker size='lg' className='absolute left-4 top-4 z-10 shadow-hard-sm sm:left-6 sm:top-6'>
        ★ Lead story
      </Sticker>

      <div className='relative z-10 flex flex-1 flex-col bg-ink p-6 text-paper sm:p-8 md:mx-8 md:-mt-36 md:mb-8 md:max-w-2xl md:flex-none md:border md:border-ink md:shadow-hard lg:p-10'>
        <div className='flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]'>
          <span className='border border-signal px-2 py-0.5 text-signal'>{category}</span>
          {createdAt && <time dateTime={createdAt} className='text-paper/60'>{formatDate(createdAt)}</time>}
          <span aria-hidden='true' className='text-paper/60'>· {formatReadingTime(description)}</span>
        </div>

        <h2 className='mt-5 font-serif text-4xl font-semibold leading-[1] tracking-tight decoration-signal decoration-4 underline-offset-[6px] group-hover:underline sm:text-5xl lg:text-6xl'>
          {title}
        </h2>

        <p className='mt-5 text-base leading-relaxed text-paper/75'>
          {truncateHtml(description, 180)}
        </p>

        <span className='mt-auto inline-flex items-center gap-3 pt-8 font-mono text-xs font-medium uppercase tracking-[0.14em] text-signal'>
          Read the story
          <span aria-hidden='true' className='inline-flex h-10 w-10 items-center justify-center border border-signal transition-transform duration-200 group-hover:translate-x-1'>
            →
          </span>
        </span>
      </div>
    </article>
  )
}

export default LeadCard
