import { useTopViewed } from '../../../../hooks/api/queries/useAnalytics'
import { getBlogDetailPath } from '../../../../constants/routes'
import { formatNumber, formatShortDate } from '../../../../utils/formatters'
import Skeleton from '../../../ui/Skeleton'

function TopViewedTable({ params }) {
  const { data, loading, error } = useTopViewed(params)

  if (loading) {
    return (
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm font-medium">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Views</th>
            <th className="px-4 py-3">Comments</th>
            <th className="px-4 py-3">Publish Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td colSpan={5} className="px-4 py-3">
                <Skeleton height={20} width="80%" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm py-4">{error}</p>
    )
  }

  const rows = (data ?? []).slice(0, 5)

  if (rows.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No posts found for the selected period</p>
    )
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-50 text-gray-600 text-sm font-medium">
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Views</th>
          <th className="px-4 py-3">Comments</th>
          <th className="px-4 py-3">Publish Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">
              <a
                href={getBlogDetailPath(row.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {row.title}
              </a>
            </td>
            <td className="px-4 py-3 text-gray-700">{row.category}</td>
            <td className="px-4 py-3">{formatNumber(row.views)}</td>
            <td className="px-4 py-3">{formatNumber(row.comments)}</td>
            <td className="px-4 py-3 text-gray-600">{formatShortDate(row.publishDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TopViewedTable
