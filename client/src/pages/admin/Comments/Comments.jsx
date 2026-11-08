import React, { useState, useMemo } from 'react'
import { CommentTableItem } from '../../../components/admin'
import { Loader } from '../../../components/ui'
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
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-background h-full min-h-full'>
      <div className='flex justify-between items-center max-w-3xl mb-4'>
        <h1 className='font-display text-3xl font-bold tracking-tight text-foreground'>Comments</h1>
        <div className='flex gap-4'>
          <button
            onClick={() => setFilter('Approved')}
            className={`border rounded-full px-4 py-1.5 cursor-pointer text-xs font-medium transition-colors duration-200 ${
              filter === 'Approved' 
                ? 'text-accent border-accent/40 bg-accent-soft'
                : 'text-muted-foreground border-border bg-card hover:bg-muted hover:text-foreground'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('Not Approved')}
            className={`border rounded-full px-4 py-1.5 cursor-pointer text-xs font-medium transition-colors duration-200 ${
              filter === 'Not Approved' 
                ? 'text-accent border-accent/40 bg-accent-soft'
                : 'text-muted-foreground border-border bg-card hover:bg-muted hover:text-foreground'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-card rounded-2xl border border-border shadow-card scrollbar-hide'>
        <table className='w-full text-sm text-muted-foreground'>
          <thead className='text-xs tracking-wider text-muted-foreground text-left uppercase bg-muted'>
            <tr>
              <th scope='col' className='px-6 py-3'>Details</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'>Date</th>
              <th scope='col' className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan='3' className='text-center py-8 text-muted-foreground'>
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
    </div>
  )
}

export default Comments
