import React, { useState, useMemo } from 'react'
import { AdminPageHeader, AdminTable, CommentTableItem } from '../../../components/admin'
import { Loader } from '../../../components/ui'
import { useAdminComments } from '../../../hooks'
import { classNames } from '../../../utils/helpers'

const FILTERS = ['Approved', 'Not Approved']

const COMMENT_COLUMNS = [
  { label: 'Details' },
  { label: 'Date', className: 'max-sm:hidden' },
  { label: 'Actions' },
]

function Comments() {
  const { comments, loading, refetch } = useAdminComments()
  const [filter, setFilter] = useState('Not Approved')

  const filteredComments = useMemo(() => {
    return filter === 'Approved'
      ? comments.filter((comment) => comment.isApproved)
      : comments.filter((comment) => !comment.isApproved)
  }, [comments, filter])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='min-h-full bg-paper p-5 md:p-10'>
      <AdminPageHeader eyebrow='Moderation' title='Comments'>
        <div role='group' aria-label='Filter comments' className='flex border border-ink'>
          {FILTERS.map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={classNames(
                'min-h-11 px-4 font-mono text-[11px] uppercase tracking-[0.14em] cursor-pointer transition-colors',
                filter === item ? 'bg-ink text-signal' : 'bg-surface text-ink hover:bg-signal'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </AdminPageHeader>

      <AdminTable
        columns={COMMENT_COLUMNS}
        isEmpty={filteredComments.length === 0}
        emptyMessage={`No ${filter.toLowerCase()} comments found`}
        className='max-w-5xl'
      >
        {filteredComments.map((comment) => (
          <CommentTableItem
            key={comment._id}
            comment={comment}
            onUpdate={refetch}
          />
        ))}
      </AdminTable>
    </div>
  )
}

export default Comments
