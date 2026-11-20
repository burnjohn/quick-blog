import React from 'react'
import { useNavigate } from 'react-router-dom'
import { truncateHtml, formatShortDate } from '../../../utils/formatters'
import { getBlogDetailPath } from '../../../constants/routes'
import { getLinkKeyHandler } from '../../../utils/helpers'
import Sticker from '../../ui/Sticker'
import { formatReadingTime, padIndex } from '../helpers'

function BlogCard({ blog, index }) {
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
      className='group lift flex h-full w-full cursor-pointer flex-col border border-ink bg-surface shadow-hard hover:shadow-hard-lg'
    >
      <div className='relative overflow-hidden border-b border-ink'>
        <img
          src={image}
          alt={title}
          loading='lazy'
          className='aspect-[4/3] w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105'
        />
      </div>
      <div className='flex flex-1 flex-col p-5 sm:p-6'>
        <Sticker size='sm' className='mb-4 self-start'>{category}</Sticker>
        <h3 className='font-serif text-2xl font-semibold leading-tight tracking-tight text-ink decoration-signal decoration-[3px] underline-offset-4 group-hover:underline'>
          {title}
        </h3>
        <p className='mt-3 mb-6 text-sm leading-relaxed text-ink-muted'>
          {truncateHtml(description, 110)}
        </p>
        <span className='mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink'>
          <span className='tabular-nums'>
            {typeof index === 'number' ? `Nº ${padIndex(index)}` : 'Story'}
            {createdAt && <span className='text-ink-muted'> · {formatShortDate(createdAt)}</span>}
          </span>
          <span aria-hidden='true' className='inline-flex items-center gap-2 text-ink-muted'>
            {formatReadingTime(description)}
            <span className='text-ink transition-transform duration-200 group-hover:translate-x-1'>→</span>
          </span>
        </span>
      </div>
    </article>
  )
}

export default BlogCard
