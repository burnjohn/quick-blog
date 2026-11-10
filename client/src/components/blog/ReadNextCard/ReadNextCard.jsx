import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import { classNames } from '../../../utils/helpers'

// Glass card in the dark style of PR #40. Must be rendered inside `.read-next-shell`.
function ReadNextCard({ blog, className }) {
  const { _id, title, subTitle, category, image } = blog

  return (
    <Link
      to={getBlogDetailPath(_id)}
      draggable={false}
      className={classNames(
        'group flex h-full min-w-0 flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:border-accent-violet/40 hover:shadow-accent-violet/10 focus-visible:border-accent-violet/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/60 motion-safe:hover:-translate-y-1 sm:p-4',
        className
      )}
    >
      <div className='relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5'>
        {image && (
          <img
            src={image}
            alt=''
            draggable={false}
            loading='lazy'
            className='h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-105'
          />
        )}
        <div
          aria-hidden='true'
          className='absolute inset-0 bg-linear-to-t from-ink-950/60 via-transparent to-transparent'
        />
      </div>
      <div className='flex min-w-0 flex-col gap-2 px-1 pb-1'>
        <span className='w-fit rounded-full border border-accent-violet/30 bg-accent-violet/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-accent-violet'>
          {category}
        </span>
        <h3 className='line-clamp-2 font-display text-lg font-semibold leading-snug text-ink-text'>
          {title}
        </h3>
        {subTitle && <p className='line-clamp-2 text-sm text-ink-muted'>{subTitle}</p>}
      </div>
    </Link>
  )
}

export default ReadNextCard
