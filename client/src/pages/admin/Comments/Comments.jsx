import React, { useState, useMemo } from 'react'
import { CommentTableItem } from '../../../components/admin'
import { Loader, Panel } from '../../../components/ui'
import { useAdminComments } from '../../../hooks'

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
    <div className='max-w-3xl p-4 md:p-10'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>SYS / COMMENTS</p>
          <h1 className='mt-2 font-display text-3xl font-bold tracking-tighter text-ink'>Comments</h1>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => setFilter('Approved')}
            aria-pressed={filter === 'Approved'}
            className={`cursor-pointer rounded-full border px-4 py-1 text-xs transition-colors ${
              filter === 'Approved'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-white/15 text-muted hover:bg-white/5 hover:text-ink'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('Not Approved')}
            aria-pressed={filter === 'Not Approved'}
            className={`cursor-pointer rounded-full border px-4 py-1 text-xs transition-colors ${
              filter === 'Not Approved'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-white/15 text-muted hover:bg-white/5 hover:text-ink'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      <Panel className='overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='border-b border-white/10 text-left'>
              <tr>
                <th scope='col' className='px-4 py-3 sm:px-6 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted'>Details</th>
                <th scope='col' className='px-4 py-3 sm:px-6 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted max-sm:hidden'>Date</th>
                <th scope='col' className='px-4 py-3 sm:px-6 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/10'>
              {filteredComments.length === 0 ? (
                <tr>
                  <td colSpan='3' className='py-8 text-center text-muted'>
                    No {filter.toLowerCase()} comments found
                  </td>
                </tr>
              ) : (
                filteredComments.map((comment) => (
                  <CommentTableItem
                    key={comment._id}
                    comment={comment}
                    onUpdate={refetch}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export default Comments
