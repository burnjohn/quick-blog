import { useLastComments } from '../../../../hooks/api/queries/useAnalytics'
import { getBlogDetailPath } from '../../../../constants/routes'
import { truncate, formatShortDate } from '../../../../utils/formatters'
import Skeleton from '../../../ui/Skeleton'
import StateMessage from '../StateMessage'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { revealOnScroll } from '../../shared/motion'

function RecentCommentsTable({ params }) {
  const { data, loading, error } = useLastComments(params)

  if (loading) {
    return (
      <div className="divide-y divide-paper/15 [&_.animate-pulse]:bg-paper/15">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="py-4 first:pt-0">
            <Skeleton height={16} width="40%" className="mb-2" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="60%" className="mt-2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <StateMessage tone="error" onInk>{error}</StateMessage>
  }

  const items = (data ?? []).slice(0, 5)

  if (items.length === 0) {
    return <StateMessage onInk>No comments found for the selected period</StateMessage>
  }

  return (
    <ol className="grid divide-paper/15 md:grid-cols-2 md:gap-x-10 max-md:divide-y xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          {...revealOnScroll(index)}
          className="border-paper/15 py-4 md:border-b"
        >
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
            <span aria-hidden="true" className="text-paper/40 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            {item.authorName ?? 'Anonymous'}
          </p>
          <p
            className="mt-2 font-serif text-lg leading-snug text-paper"
            // keep formatting
            dangerouslySetInnerHTML={{ __html: truncate(item.contentExcerpt, 50) }}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <a
              href={item.blogId ? getBlogDetailPath(item.blogId) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-paper decoration-signal decoration-[3px] underline-offset-4 hover:underline"
            >
              {item.blogTitle}
            </a>
            <span aria-hidden="true" className="text-paper/30">/</span>
            <span className="font-mono text-xs text-paper/60">{formatShortDate(item.createdAt)}</span>
            <span
              className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
                item.status === 'approved' ? 'text-[#7BD88F]' : 'text-signal'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 ${item.status === 'approved' ? 'bg-[#7BD88F]' : 'bg-signal'}`}
              />
              {item.status === 'approved' ? 'Approved' : 'Pending'}
            </span>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

export default RecentCommentsTable
