import { useTopCommented } from '../../../../hooks/api/queries/useAnalytics'
import { getBlogDetailPath } from '../../../../constants/routes'
import { formatNumber } from '../../../../utils/formatters'
import Skeleton from '../../../ui/Skeleton'
import AdminTable, { AdminTableRow } from '../../shared/AdminTable'
import StateMessage from '../StateMessage'

const COLUMNS = [
  { label: 'Title' },
  { label: 'Category', className: 'max-sm:hidden' },
  { label: 'Comments' },
  { label: 'Views', className: 'max-sm:hidden' }
]

function TopCommentedTable({ params }) {
  const { data, loading, error } = useTopCommented(params)

  if (loading) {
    return (
      <AdminTable columns={COLUMNS}>
        {Array.from({ length: 5 }).map((_, i) => (
          <tr key={i} className="border-b border-line last:border-b-0">
            <td colSpan={COLUMNS.length} className="px-4 py-4">
              <Skeleton height={16} width="80%" />
            </td>
          </tr>
        ))}
      </AdminTable>
    )
  }

  if (error) {
    return <StateMessage tone="error">{error}</StateMessage>
  }

  const rows = (data ?? []).slice(0, 5)

  return (
    <AdminTable
      columns={COLUMNS}
      isEmpty={rows.length === 0}
      emptyMessage="No posts found for the selected period"
    >
      {rows.map((row, index) => {
        const comments = row.comments ?? {}
        const commentsStr = `${comments.approved ?? 0} / ${comments.total ?? 0}`
        return (
          <AdminTableRow key={row.id} index={index}>
            <td className="px-4 py-4 font-medium">
              <a
                href={getBlogDetailPath(row.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink decoration-signal decoration-[3px] underline-offset-4 hover:underline"
              >
                {row.title}
              </a>
            </td>
            <td className="px-4 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted max-sm:hidden">{row.category}</td>
            <td className="px-4 py-4 font-mono tabular-nums">{commentsStr}</td>
            <td className="px-4 py-4 font-mono tabular-nums max-sm:hidden">{formatNumber(row.views)}</td>
          </AdminTableRow>
        )
      })}
    </AdminTable>
  )
}

export default TopCommentedTable
