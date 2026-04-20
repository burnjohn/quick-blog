import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../ui/Card'
import Badge from '../../../ui/Badge'
import Skeleton from '../../../ui/Skeleton'
import { getBlogDetailPath } from '../../../../constants/routes'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const COLUMN_COUNT = 4

function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
}

function StatusBadge({ isApproved }) {
  if (isApproved) {
    return <Badge variant='success' size='sm'>Approved</Badge>
  }
  return <Badge variant='pending' size='sm'>Pending</Badge>
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

function RecentCommentsTable({ rows, loading = false }) {
  return (
    <Card>
      <Card.Body>
        <h3 className='mb-3 text-sm font-semibold text-gray-900'>Recent Comments</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500'>
                <th className='px-3 py-2 font-medium'>Author</th>
                <th className='px-3 py-2 font-medium'>Comment</th>
                <th className='px-3 py-2 font-medium'>Post</th>
                <th className='px-3 py-2 font-medium'>Status</th>
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
                  const blogId = row.blogId ?? row.blog?._id ?? row.blog?.id
                  const blogTitle = row.blogTitle ?? row.blog?.title ?? 'Untitled'
                  const dateValue = row.createdAt ?? row.date
                  return (
                    <tr
                      key={row._id ?? row.id}
                      className='border-b border-gray-100 align-top hover:bg-gray-50'
                    >
                      <td className='px-3 py-3 font-semibold text-gray-900'>
                        {row.name ?? row.author ?? 'Anonymous'}
                      </td>
                      <td className='px-3 py-3'>
                        <p className='italic text-gray-700'>{row.content ?? row.text}</p>
                      </td>
                      <td className='px-3 py-3'>
                        {blogId ? (
                          <Link
                            to={getBlogDetailPath(blogId)}
                            className='text-primary hover:underline'
                          >
                            {blogTitle}
                          </Link>
                        ) : (
                          <span className='text-gray-700'>{blogTitle}</span>
                        )}
                        <div className='text-xs text-gray-500'>{formatDate(dateValue)}</div>
                      </td>
                      <td className='px-3 py-3'>
                        <StatusBadge isApproved={Boolean(row.isApproved)} />
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

export default RecentCommentsTable
