import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import Sticker from '../../ui/Sticker'
import ReadStats from './ReadStats'

/** #1 of the ranking: big photo with the rank numeral, headline, excerpt and stats */
function MostReadFeature({ post }) {
  const { _id, title, subTitle, excerpt, category, image, views, comments } = post

  return (
    <Link
      to={getBlogDetailPath(_id)}
      className='group lift grid border border-ink bg-surface shadow-hard hover:shadow-hard-lg lg:grid-cols-12'
    >
      <span className='relative block aspect-[4/3] overflow-hidden border-b border-ink bg-line lg:col-span-7 lg:border-b-0 lg:border-r'>
        <img
          src={image}
          alt={title}
          loading='lazy'
          className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105'
        />
        <span
          aria-hidden='true'
          className='absolute bottom-0 left-0 border-r border-t border-ink bg-paper px-4 pt-2 font-serif text-8xl font-semibold leading-[0.8] tracking-tight text-ink sm:text-9xl'
        >
          1
        </span>
      </span>

      <span className='flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10'>
        <span className='flex flex-wrap items-center gap-3'>
          <Sticker size='sm'>{category}</Sticker>
          <span className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>Most read</span>
        </span>
        <span className='mt-5 block font-serif text-3xl font-semibold leading-[1.02] tracking-tight text-ink decoration-signal decoration-4 underline-offset-[6px] group-hover:underline sm:text-4xl xl:text-5xl'>
          {title}
        </span>
        {subTitle && (
          <span className='mt-4 block font-serif text-lg italic leading-snug text-ink-muted'>{subTitle}</span>
        )}
        {excerpt && <span className='mt-4 block text-sm leading-relaxed text-ink-muted sm:text-base'>{excerpt}</span>}
        <span className='mt-auto block pt-8'>
          <ReadStats views={views} comments={comments} ratio={1} large />
        </span>
      </span>
    </Link>
  )
}

export default MostReadFeature
