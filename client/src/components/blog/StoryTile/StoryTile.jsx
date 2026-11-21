import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import { truncateHtml, formatShortDate } from '../../../utils/formatters'
import { classNames } from '../../../utils/helpers'
import Sticker from '../../ui/Sticker'
import { formatReadingTime, padIndex } from '../helpers'

const tones = {
  surface: 'bg-surface text-ink shadow-hard hover:shadow-hard-lg',
  signal: 'bg-signal text-ink shadow-hard hover:shadow-hard-lg'
}

/**
 * Secondary front-page story. `showImage` renders the cover on top;
 * without it the tile gets a halftone masthead with its index number.
 */
function StoryTile({ blog, index = 0, tone = 'surface', showImage = true, className = '' }) {
  const { _id, title, description, category, image, createdAt } = blog

  return (
    <Link
      to={getBlogDetailPath(_id)}
      className={classNames(
        'group lift flex h-full flex-col border border-ink',
        tones[tone],
        className
      )}
    >
      {showImage && image ? (
        <div className='relative aspect-[16/10] overflow-hidden border-b border-ink'>
          <img
            src={image}
            alt=''
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105'
          />
        </div>
      ) : (
        <div aria-hidden='true' className='halftone relative flex h-24 items-end justify-between border-b border-ink px-5 pb-2'>
          <span className='bg-signal px-1 font-serif text-6xl font-semibold leading-none tracking-tight tabular-nums'>
            {padIndex(index)}
          </span>
          <span className='mb-2 bg-signal px-1 font-mono text-[11px] uppercase tracking-[0.18em]'>Also on the front</span>
        </div>
      )}

      <div className='flex flex-1 flex-col p-5 sm:p-6'>
        <div className='flex items-center justify-between gap-3'>
          <Sticker size='sm' tone={tone === 'signal' ? 'paper' : 'signal'}>{category}</Sticker>
          <span className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted tabular-nums'>
            Nº {padIndex(index)}
          </span>
        </div>
        <h3 className='mt-4 font-serif text-2xl font-semibold leading-[1.08] tracking-tight decoration-ink decoration-2 underline-offset-4 group-hover:underline sm:text-3xl'>
          {title}
        </h3>
        <p className={classNames('mt-3 text-sm leading-relaxed', tone === 'signal' ? 'text-ink/75' : 'text-ink-muted')}>
          {truncateHtml(description, 120)}
        </p>
        <span className='mt-auto flex items-center justify-between pt-5 font-mono text-[11px] uppercase tracking-[0.14em]'>
          <span>{formatShortDate(createdAt)} · {formatReadingTime(description)}</span>
          <span aria-hidden='true' className='transition-transform duration-200 group-hover:translate-x-1'>→</span>
        </span>
      </div>
    </Link>
  )
}

export default StoryTile
