import { useLastComments } from '../../../../hooks/api/queries/useAnalytics'
import { getBlogDetailPath } from '../../../../constants/routes'
import { truncate, formatShortDate } from '../../../../utils/formatters'
import Skeleton from '../../../ui/Skeleton'

function RecentCommentsTable({ params }) {
  const { data, loading, error } = useLastComments(params)

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-gray-100 pb-3">
            <Skeleton height={16} width="40%" className="mb-2" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="60%" className="mt-2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm py-4">{error}</p>
    )
  }

  const items = (data ?? []).slice(0, 5)

  if (items.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No comments found for the selected period</p>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border-b border-gray-100 pb-3 last:border-b-0 hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
        >
          <p className="text-sm font-medium text-gray-800">{item.authorName ?? 'Anonymous'}</p>
          <p className="text-sm text-gray-600 mt-1">
            {truncate(item.contentExcerpt, 50)}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <a
              href={item.blogId ? getBlogDetailPath(item.blogId) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {item.blogTitle}
            </a>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{formatShortDate(item.createdAt)}</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {item.status === 'approved' ? 'Approved' : 'Pending'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentCommentsTable
