import React, { useMemo } from 'react'
import { classNames } from '../../../../utils/helpers'
import { formatNumber, formatDuration, formatPercent } from '../../../../utils/analyticsFormat'
import { DEFAULT_SORT, DEFAULT_DIR } from '../../../../constants/analytics'
import { sortPosts, nextSort } from './sortPosts'

const COLUMNS = [
  { key: 'views', label: 'Views', format: formatNumber },
  { key: 'uniqueVisitors', label: 'Unique', format: formatNumber },
  { key: 'avgReadTimeSec', label: 'Read time', format: formatDuration },
  { key: 'avgScrollDepth', label: 'Scroll', format: formatPercent },
  { key: 'engagementRate', label: 'Engagement', format: formatPercent },
  { key: 'subscriptions', label: 'Subs', format: formatNumber },
  { key: 'comments', label: 'Comments', format: formatNumber },
  { key: 'likes', label: 'Likes', format: formatNumber },
]

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan'
const chip = 'rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-ink-muted'

function SortButton({ column, label, sort, dir, onSort, align }) {
  const active = sort === column
  return (
    <button
      type='button'
      onClick={() => onSort(column)}
      className={classNames(
        'inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs font-medium uppercase tracking-wide transition-colors hover:text-ink-text',
        focusRing,
        active ? 'text-accent-cyan' : 'text-ink-muted',
        align === 'right' && 'flex-row-reverse'
      )}
    >
      {label}
      <span aria-hidden='true'>{active ? (dir === 'asc' ? '▲' : '▼') : '↕'}</span>
    </button>
  )
}

function TopPostsTable({
  posts = [],
  sort = DEFAULT_SORT,
  dir = DEFAULT_DIR,
  onSortChange,
  onOpenPost,
  className,
}) {
  const rows = useMemo(() => sortPosts(posts, sort, dir), [posts, sort, dir])
  const ariaSort = (column) =>
    sort === column ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'

  const handleSort = (column) => {
    const next = nextSort(column, sort, dir)
    onSortChange?.(next.sort, next.dir)
  }

  return (
    <div
      className={classNames(
        'overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-md',
        className
      )}
    >
      <table className='w-full min-w-[960px] border-collapse text-sm'>
        <caption className='sr-only'>
          Top posts by performance. Use the column header buttons to sort.
        </caption>
        <thead>
          <tr className='border-b border-white/10'>
            <th
              scope='col'
              aria-sort={ariaSort('title')}
              className='sticky left-0 z-10 bg-ink-800 px-4 py-3 text-left'
            >
              <SortButton column='title' label='Post' sort={sort} dir={dir} onSort={handleSort} />
            </th>
            {COLUMNS.map((col) => (
              <th key={col.key} scope='col' aria-sort={ariaSort(col.key)} className='px-3 py-3 text-right'>
                <SortButton
                  column={col.key}
                  label={col.label}
                  sort={sort}
                  dir={dir}
                  onSort={handleSort}
                  align='right'
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((post) => (
            <tr key={post.id} className='border-b border-white/5 transition-colors last:border-0 hover:bg-white/5'>
              <th scope='row' className='sticky left-0 z-10 max-w-xs bg-ink-800 px-4 py-3 text-left font-normal'>
                <button
                  type='button'
                  onClick={(event) => onOpenPost?.(post.id, event.currentTarget)}
                  className={classNames(
                    'block max-w-full truncate rounded text-left font-display font-semibold text-ink-text hover:text-accent-cyan',
                    focusRing
                  )}
                >
                  {post.title}
                </button>
                <div className='mt-1 flex flex-wrap gap-1'>
                  {post.category && (
                    <span className='rounded-full bg-accent-violet/20 px-2 py-0.5 text-[11px] text-accent-violet'>
                      {post.category}
                    </span>
                  )}
                  {(post.tags || []).map((tag) => (
                    <span key={tag} className={chip}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </th>
              {COLUMNS.map((col) => (
                <td key={col.key} className='px-3 py-3 text-right font-mono tabular-nums text-ink-text'>
                  {col.format(post[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopPostsTable
