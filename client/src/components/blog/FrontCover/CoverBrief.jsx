import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import { formatShortDate } from '../../../utils/formatters'
import { formatReadingTime } from '../helpers'

/** Secondary cover story: 4:3 photo thumbnail beside a compact headline */
function CoverBrief({ blog }) {
  const { _id, title, description, category, image, createdAt } = blog

  return (
    <Link
      to={getBlogDetailPath(_id)}
      className='group grid grid-cols-[7.5rem_1fr] items-start gap-4 py-3.5 sm:grid-cols-[10rem_1fr] lg:grid-cols-[8.5rem_1fr] lg:py-3'
    >
      <span className='relative block aspect-[4/3] overflow-hidden border border-ink bg-line'>
        <img
          src={image}
          alt={title}
          className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105'
        />
      </span>
      <span className='min-w-0'>
        <span className='block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted sm:text-[11px]'>
          <span className='text-ink'>{category}</span> · {formatReadingTime(description)}
        </span>
        <span className='mt-1 line-clamp-3 font-serif text-lg font-semibold leading-[1.15] tracking-tight text-ink decoration-signal decoration-[3px] underline-offset-4 group-hover:underline sm:text-xl'>
          {title}
        </span>
        {createdAt && (
          <time dateTime={createdAt} className='mt-1.5 hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted sm:block'>
            {formatShortDate(createdAt)}
          </time>
        )}
      </span>
    </Link>
  )
}

export default CoverBrief
