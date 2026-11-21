import React, { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { AdminPageHeader, AdminTable, CommentTableItem, SegmentedControl } from '../../../components/admin'
import { EASE_EDITORIAL } from '../../../components/admin/shared/motion'
import { Loader } from '../../../components/ui'
import { useAdminComments } from '../../../hooks'

const FILTERS = ['Approved', 'Not Approved']

const COMMENT_COLUMNS = [
  { label: 'Details' },
  { label: 'Date', className: 'max-sm:hidden' },
  { label: 'Actions' },
]

const PANEL_MOTION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_EDITORIAL } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } }
}

function Comments() {
  const { comments, loading, refetch } = useAdminComments()
  const [filter, setFilter] = useState('Not Approved')

  const filteredComments = useMemo(() => {
    return filter === 'Approved'
      ? comments.filter((comment) => comment.isApproved)
      : comments.filter((comment) => !comment.isApproved)
  }, [comments, filter])

  const approvedCount = comments.filter((comment) => comment.isApproved).length
  const filterOptions = FILTERS.map((item) => ({
    value: item,
    label: item,
    count: item === 'Approved' ? approvedCount : comments.length - approvedCount,
  }))

  // Only block on the first load; refetches keep rows mounted so approve /
  // delete can animate the row out of the current tab.
  if (loading && comments.length === 0) {
    return <Loader />
  }

  return (
    <div className='min-h-full bg-paper p-5 md:p-10'>
      <AdminPageHeader eyebrow='Moderation' title='Comments'>
        <SegmentedControl
          label='Filter comments'
          layoutId='comment-filter'
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
      </AdminPageHeader>

      <AnimatePresence mode='wait' initial={false}>
        <motion.div key={filter} {...PANEL_MOTION}>
          <AdminTable
            columns={COMMENT_COLUMNS}
            isEmpty={filteredComments.length === 0}
            emptyMessage={`No ${filter.toLowerCase()} comments found`}
            emptyHint={filter === 'Approved' ? 'Approve a comment to publish it' : 'The moderation queue is clear'}
          >
            {filteredComments.map((comment, index) => (
              <CommentTableItem
                key={comment._id}
                comment={comment}
                onUpdate={refetch}
                index={index}
              />
            ))}
          </AdminTable>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Comments
