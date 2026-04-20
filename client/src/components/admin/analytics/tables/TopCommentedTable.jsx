import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../ui/Card'
import Skeleton from '../../../ui/Skeleton'
import { getBlogDetailPath } from '../../../../constants/routes'

const numberFormatter = new Intl.NumberFormat('en-US')

const COLUMN_COUNT = 4

function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return numberFormatter.format(value)
}

function SkeletonRow() {
  return (
    <tr className='border-b border-gray-100'>
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
        <td key={i} className='px-3 py-3'>
          <Skeleton height={14} />
        </td>
      ))}
    </tr>
  )
}

function TopCommentedTable({ rows, loading = false }) {
  return (
    <Card>
      <Card.Body>
        <h3 className='mb-3 text-sm font-semibold text-gray-900'>Top Commented Posts</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500'>
                <th className='px-3 py-2 font-medium'>Title</th>
                <th className='px-3 py-2 font-medium'>Category</th>
                <th className='px-3 py-2 font-medium text-right'>Comments</th>
                <th className='px-3 py-2 font-medium text-right'>Views</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : !rows || rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className='px-3 py-8 text-center text-sm text-gray-500'
                  >
                    No data for selected period
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const id = row._id ?? row.id
                  const approved = row.approvedComments ?? row.comments ?? 0
                  const total = row.totalComments ?? row.commentsTotal ?? approved
                  return (
                    <tr key={id} className='border-b border-gray-100 hover:bg-gray-50'>
                      <td className='px-3 py-3'>
                        {id ? (
                          <Link
                            to={getBlogDetailPath(id)}
                            className='font-medium text-primary hover:underline'
                          >
                            {row.title}
                          </Link>
                        ) : (
                          <span className='font-medium text-gray-900'>{row.title}</span>
                        )}
                      </td>
                      <td className='px-3 py-3 text-gray-600'>{row.category ?? '—'}</td>
                      <td className='px-3 py-3 text-right tabular-nums text-gray-900'>
                        {formatNumber(approved)} / {formatNumber(total)}
                      </td>
                      <td className='px-3 py-3 text-right tabular-nums text-gray-900'>
                        {formatNumber(row.views)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  )
}

export default TopCommentedTable
