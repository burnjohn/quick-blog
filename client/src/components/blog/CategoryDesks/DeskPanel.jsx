import React from 'react'
import { Link } from 'react-router-dom'
import { getBlogDetailPath } from '../../../constants/routes'
import { formatShortDate } from '../../../utils/formatters'
import Sticker from '../../ui/Sticker'
import { formatReadingTime, slugify } from '../helpers'

const MAX_HEADLINES = 3

/** One category desk: lead photo + headline, then a few more headlines with square thumbs */
function DeskPanel({ category, posts, total = posts.length }) {
  const [top, ...more] = posts
  const slug = slugify(category)

  return (
    <article
      id={`desk-${slug}`}
      aria-labelledby={`desk-${slug}-title`}
      className='flex h-full scroll-mt-28 flex-col border border-ink bg-surface shadow-hard'
    >
      <header className='flex items-end justify-between gap-4 border-b-2 border-ink px-5 pt-5 pb-3 sm:px-6'>
        <h3 id={`desk-${slug}-title`} className='font-serif text-4xl font-semibold italic leading-none tracking-tight text-ink sm:text-5xl'>
          {category}
        </h3>
        <Sticker size='sm' tilt='right'>
          {total} {total === 1 ? 'story' : 'stories'}
        </Sticker>
      </header>

      <Link to={getBlogDetailPath(top._id)} className='group block border-b border-line p-5 sm:p-6'>
        <span className='relative block aspect-[16/9] overflow-hidden border border-ink bg-line'>
          <img
            src={top.image}
            alt={top.title}
            loading='lazy'
            className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105'
          />
        </span>
        <span className='mt-4 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted'>
          Desk lead · {formatShortDate(top.createdAt)} · {formatReadingTime(top.description)}
        </span>
        <span className='mt-2 block font-serif text-2xl font-semibold leading-tight tracking-tight text-ink decoration-signal decoration-[3px] underline-offset-4 group-hover:underline sm:text-3xl'>
          {top.title}
        </span>
      </Link>

      {more.length > 0 && (
        <ul className='flex-1 px-5 sm:px-6'>
          {more.slice(0, MAX_HEADLINES).map((post) => (
            <li key={post._id} className='border-b border-line last:border-b-0'>
              <Link to={getBlogDetailPath(post._id)} className='group flex min-h-14 items-center gap-4 py-3'>
                <span className='relative block h-14 w-14 shrink-0 overflow-hidden border border-ink bg-line'>
                  <img
                    src={post.image}
                    alt={post.title}
                    loading='lazy'
                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-110'
                  />
                </span>
                <span className='min-w-0'>
                  <span className='relative font-semibold leading-snug text-ink'>
                    {post.title}
                    <span aria-hidden='true' className='absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-signal transition-transform duration-200 ease-editorial group-hover:scale-x-100' />
                  </span>
                  <span className='mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted'>
                    {formatShortDate(post.createdAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default DeskPanel
