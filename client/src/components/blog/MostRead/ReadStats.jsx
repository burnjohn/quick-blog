import React from 'react'
import { formatNumber } from '../../../utils/formatters'
import { classNames } from '../../../utils/helpers'
import ReadsBar from './ReadsBar'

/** Reads + comments in tabular mono, with the bar relative to the #1 post */
function ReadStats({ views, comments, ratio, large = false }) {
  return (
    <span className='block'>
      <span className='flex items-baseline justify-between gap-4 font-mono tabular-nums'>
        <span>
          <span className={classNames('font-medium text-ink', large ? 'text-3xl' : 'text-xl')}>{formatNumber(views)}</span>
          <span className='ml-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-muted'>reads</span>
        </span>
        <span className='text-[11px] uppercase tracking-[0.14em] text-ink-muted'>
          <span className='text-ink'>{formatNumber(comments)}</span> {comments === 1 ? 'comment' : 'comments'}
        </span>
      </span>
      <ReadsBar ratio={ratio} className={large ? 'mt-3 h-2' : 'mt-2'} />
    </span>
  )
}

export default ReadStats
