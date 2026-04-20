import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../ui/Card'
import Skeleton from '../../../ui/Skeleton'
import { getBlogDetailPath } from '../../../../constants/routes'

const numberFormatter = new Intl.NumberFormat('en-US')
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const COLUMN_COUNT = 5

function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return numberFormatter.format(value)
}

function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
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

function TopViewedTable({ rows, loading = false }) {
  return (
    <Card>
      <Card.Body>
        <h3 className='mb-3 text-sm font-semibold text-gray-900'>Top Viewed Posts</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500'>
                <th className='px-3 py-2 font-medium'>Title</th>
                <th className='px-3 py-2 font-medium'>Category</th>
                <th className='px-3 py-2 font-medium text-right'>Views</th>
                <th className='px-3 py-2 font-medium text-right'>Comments</th>
                <th className='px-3 py-2 font-medium'>Published</th>
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
                        {formatNumber(row.views)}
                      </td>
                      <td className='px-3 py-3 text-right tabular-nums text-gray-900'>
                        {formatNumber(row.comments)}
                      </td>
                      <td className='px-3 py-3 text-gray-600'>
                        {formatDate(row.publishedAt ?? row.createdAt)}
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

export default TopViewedTable
