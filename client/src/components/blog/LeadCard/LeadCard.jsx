import React from 'react'
import { useNavigate } from 'react-router-dom'
import { truncateHtml, formatDate } from '../../../utils/formatters'
import { getBlogDetailPath } from '../../../constants/routes'
import { getLinkKeyHandler } from '../../../utils/helpers'

function LeadCard({ blog }) {
  const { title, description, category, image, _id, createdAt } = blog
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(getBlogDetailPath(_id))
  }

  return (
    <article
      onClick={handleClick}
      onKeyDown={getLinkKeyHandler(handleClick)}
      role='link'
      tabIndex={0}
      aria-label={title}
      className='group grid cursor-pointer overflow-hidden border border-ink bg-surface md:grid-cols-12'
    >
      <div className='relative overflow-hidden border-b border-ink md:col-span-7 md:border-b-0 md:border-r'>
        <img
          src={image}
          alt={title}
          className='aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:aspect-auto md:min-h-[26rem]'
        />
        <span className='absolute left-0 top-0 bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-signal'>
          Lead story
        </span>
      </div>

      <div className='flex flex-col p-6 sm:p-10 md:col-span-5'>
        <div className='flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]'>
          <span className='bg-signal px-2 py-0.5 text-ink'>{category}</span>
          {createdAt && <span className='text-ink-muted'>{formatDate(createdAt)}</span>}
        </div>

        <h2 className='mt-6 font-serif text-4xl font-semibold leading-[1.02] tracking-tight text-ink decoration-signal decoration-4 underline-offset-[6px] group-hover:underline sm:text-5xl'>
          {title}
        </h2>

        <p className='mt-6 text-base leading-relaxed text-ink-muted'>
          {truncateHtml(description, 220)}
        </p>

        <span className='mt-auto inline-flex items-center gap-3 pt-10 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink'>
          Read the story
          <span aria-hidden='true' className='inline-flex h-10 w-10 items-center justify-center border border-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-signal'>
            →
          </span>
        </span>
      </div>
    </article>
  )
}

export default LeadCard
