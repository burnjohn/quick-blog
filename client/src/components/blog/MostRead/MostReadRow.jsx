import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import Sticker from '../../ui/Sticker'
import ReadStats from './ReadStats'

/** Ranked row: numeral, 4:3 thumb, headline + excerpt, stats. Stacks below lg. */
function MostReadRow({ post, rank, ratio }) {
  const { _id, title, excerpt, category, image, views, comments } = post

  return (
    <Link
      to={getBlogDetailPath(_id)}
      className='group grid grid-cols-[2.25rem_7rem_minmax(0,1fr)] items-start gap-x-4 gap-y-4 py-6 transition-colors hover:bg-surface sm:grid-cols-[3rem_10rem_minmax(0,1fr)] lg:grid-cols-[4.5rem_11rem_minmax(0,1fr)_15rem] lg:items-center lg:gap-x-8 lg:px-2'
    >
      <span aria-hidden='true' className='font-serif text-5xl font-semibold leading-[0.85] tracking-tight text-ink sm:text-6xl lg:text-7xl'>
        {rank}
      </span>

      <span className='relative block aspect-[4/3] overflow-hidden border border-ink bg-line'>
        <img
          src={image}
          alt={title}
          loading='lazy'
          className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105'
        />
      </span>

      <span className='min-w-0'>
        <Sticker size='sm' tilt='none'>{category}</Sticker>
        <span className='mt-2 line-clamp-3 font-serif text-lg font-semibold leading-[1.15] tracking-tight text-ink decoration-signal decoration-[3px] underline-offset-4 group-hover:underline sm:text-2xl'>
          {title}
        </span>
        {excerpt && (
          <span className='mt-2 line-clamp-2 hidden text-sm leading-relaxed text-ink-muted sm:block'>{excerpt}</span>
        )}
      </span>

      <span className='col-span-3 block lg:col-span-1'>
        <ReadStats views={views} comments={comments} ratio={ratio} />
      </span>
    </Link>
  )
}

export default MostReadRow
